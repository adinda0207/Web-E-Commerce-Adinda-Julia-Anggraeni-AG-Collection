    // konfigurasi admin
        const ADMIN_USERNAME = "admin";
        const ADMIN_PASSWORD = "admin123";
        let isAdminLoggedIn = false;

        // data produk
        const defaultProducts = [
            {
                id: 1,
                name: "Leather Jacket",
                price: 400000,
                category: "Wanita",
                image: "image/latter.jpg",
                stock: 10,
                description: "Jaket kulit sintetis premium dengan potongan Regular fit. Cocok dipakai untuk gaya kasual maupun semi-formal, tahan lama dan nyaman dipakai sepanjang hari."
            },
            {
                id: 2,
                name: "Denim Jacket Vintage",
                price: 370000,
                category: "Pria",
                image: "image/denim.jpg",
                stock: 8,
                description: "Jaket denim bergaya vintage dengan washing khas retro. Bahan tebal dan kuat, cocok dipadukan dengan kaos polos atau kemeja flanel."
            },
            {
                id: 3,
                name: "Adidas Cheongsam Chinese Jacket",
                price: 2500000,
                category: "Wanita",
                image: "image/cheongsam.jpg",
                stock: 3,
                description: "Jaket kolaborasi bermotif Cheongsam khas Tionghoa dengan sentuhan modern sporty. Item edisi terbatas, bahan premium dan detail bordir eksklusif."
            },
            {
                id: 4,
                name: "Jeans Retro",
                price: 260000,
                category: "Unisex",
                image: "image/jeans.jpg",
                stock: 15,
                description: "Celana jeans potongan retro dengan warna klasik. Nyaman dipakai harian, cocok untuk pria maupun wanita, bahan denim tebal tidak mudah melar."
            },
            {
                id: 5,
                name: "Black Jorst",
                price: 210000,
                category: "Unisex",
                image: "image/jorst.jpg",
                stock: 12,
                description: "Celana jorts (jeans short) warna hitam, simpel dan mudah dipadupadankan. Pilihan tepat untuk gaya santai sehari-hari."
            },
            {
                id: 6,
                name: "T-shirt Boxy",
                price: 125000,
                category: "Pria",
                image: "image/boxy.jpg",
                stock: 20,
                description: "Kaos boxy fit dengan bahan katun combed lembut dan adem. Potongan agak longgar mengikuti tren streetwear masa kini."
            },
            {
                id: 7,
                name: "Y2K Layered Tee",
                price: 120000,
                category: "Wanita",
                image: "image/layered.jpg",
                stock: 18,
                description: "Kaos bergaya Y2K dengan efek layer palsu (fake layer), memberi kesan berlapis tanpa perlu memakai dua baju. Nyaman dan kekinian."
            },
            {
                id: 8,
                name: "Plaid Lace Shirt Anak",
                price: 105000,
                category: "Anak-anak",
                image: "image/anak.jpg",
                stock: 10,
                description: "Kemeja motif kotak-kotak (plaid) dengan aksen renda untuk anak-anak. Bahan lembut dan aman untuk kulit sensitif anak."
            },
            {
                id: 9,
                name: "Lace Belt",
                price: 89000,
                category: "Aksesoris",
                image: "image/belt.jpg",
                stock: 25,
                description: "Ikat pinggang aksen renda (lace) untuk mempercantik tampilan outfit. Aksesoris ringan yang cocok untuk berbagai gaya pakaian."
            },
        ];

        let products = loadProducts();
        let cart = loadCartFromStorage();
        let currentPaymentMethod = null;
        let currentDetailProductId = null;

        // penyimpanan produk (localStorage)
        function loadProducts() {
            try {
                const saved = JSON.parse(localStorage.getItem('ag_products_v2') || 'null');
                if (Array.isArray(saved) && saved.length > 0) {
                    return saved;
                }
            } catch (e) { }

            /// Cek data lama jika ada
            let savedStock = {};
            try {
                savedStock = JSON.parse(localStorage.getItem('ag_stock') || '{}');
            } catch (e) {
                savedStock = {};
            }
            return defaultProducts.map(p => ({
                ...p,
                stock: (savedStock[p.id] !== undefined) ? savedStock[p.id] : p.stock
            }));
        }

        function saveProducts() {
            try {
                localStorage.setItem('ag_products_v2', JSON.stringify(products));
            } catch (e) { }
        }

        function escapeHtml(str) {
            return String(str == null ? '' : str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function loadCartFromStorage() {
            try {
                return JSON.parse(localStorage.getItem('ag_cart') || '[]');
            } catch (e) {
                return [];
            }
        }

        function saveCartToStorage() {
            try {
                localStorage.setItem('ag_cart', JSON.stringify(cart));
            } catch (e) { /* abaikan */ }
        }

        // DOM Elements
        const productsGrid = document.getElementById('products-grid');
        const cartCount = document.getElementById('cart-count');
        const modal = document.getElementById('cart-modal');
        const cartModalCount = document.getElementById('modal-cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const paymentModal = document.getElementById('payment-modal');
        const productDetailModal = document.getElementById('product-detail-modal');
        const adminLoginModal = document.getElementById('admin-login-modal');
        const adminPanelModal = document.getElementById('admin-panel-modal');

        // render produk
        function renderProducts(productsToShow = products) {
            productsGrid.innerHTML = productsToShow.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 250%22><rect fill=%22%23d4b483%22 width=%22300%22 height=%22250%22/><text x=%22150%22 y=%22130%22 font-family=%22Poppins%22 font-size=%2214%22 fill=%22%235c4033%22 text-anchor=%22middle%22>📷</text></svg>'">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                        <p class="stock-info ${product.stock <= 3 && product.stock > 0 ? 'low' : ''}">
                            ${product.stock > 0 ? 'Stok: ' + product.stock : 'Stok Habis'}
                        </p>
                        <div class="product-actions">
                            <button class="view-detail-btn" onclick="showProductDetail(${product.id})">
                                🔍 Lihat Detail
                            </button>
                            <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                                ${product.stock <= 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Filter kategori
        document.querySelectorAll('.kategori-card').forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                const filteredProducts = products.filter(p => p.category.toLowerCase().includes(category));
                if (filteredProducts.length > 0) {
                    renderProducts(filteredProducts);
                    productsGrid.scrollIntoView({ behavior: 'smooth' });
                } else {
                    showNotification('🔥 Segera hadir - Produk kategori ini belum tersedia!');
                }
            });
        });

        // Scroll ke produk
        function scrollToProducts() {
            document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
        }

        // detail produk
        function showProductDetail(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            currentDetailProductId = productId;

            document.getElementById('detail-image').src = product.image;
            document.getElementById('detail-image').alt = product.name;
            document.getElementById('detail-name-title').textContent = product.name;
            document.getElementById('detail-category').textContent = product.category;
            document.getElementById('detail-price').textContent = 'Rp ' + product.price.toLocaleString('id-ID');
            document.getElementById('detail-description').textContent = product.description || 'Deskripsi belum tersedia.';

            const stockEl = document.getElementById('detail-stock');
            stockEl.textContent = product.stock > 0 ? ('Stok tersedia: ' + product.stock) : 'Stok Habis';
            stockEl.style.color = product.stock > 0 ? '#5c4033' : '#e74c3c';

            const addBtn = document.getElementById('detail-add-btn');
            if (product.stock <= 0) {
                addBtn.disabled = true;
                addBtn.textContent = 'Stok Habis';
            } else {
                addBtn.disabled = false;
                addBtn.textContent = 'Tambah ke Keranjang';
            }

            productDetailModal.style.display = 'block';
        }

        function closeProductDetail() {
            productDetailModal.style.display = 'none';
            currentDetailProductId = null;
        }

        function addToCartFromDetail() {
            if (currentDetailProductId !== null) {
                addToCart(currentDetailProductId);
                closeProductDetail();
            }
        }

        // Tambah ke keranjang
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            if (product.stock <= 0) {
                showNotification('⚠️ Maaf, stok ' + product.name + ' sedang habis.');
                return;
            }

            const existingItem = cart.find(item => item.id === productId);
            const currentQtyInCart = existingItem ? existingItem.quantity : 0;

            if (currentQtyInCart + 1 > product.stock) {
                showNotification('⚠️ Stok ' + product.name + ' tidak mencukupi.');
                return;
            }

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            saveCartToStorage();
            updateCartDisplay();
            showNotification('✅ ' + product.name + ' ditambahkan ke keranjang!');
        }

        // Update tampilan keranjang
        function updateCartDisplay() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartModalCount.textContent = totalItems;
        }

        // Tampilkan keranjang
        function showCart() {
            modal.style.display = 'block';
            renderCartItems();
        }

        // Tutup keranjang
        function closeCart() {
            modal.style.display = 'none';
        }

        // Render item keranjang
        function renderCartItems() {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="cart-empty-message">Keranjang kosong 😢<br><small>Klik "Tambah ke Keranjang" untuk memulai belanja</small></p>';
                cartTotal.textContent = '0';
                return;
            }

            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23d4b483%22 width=%2260%22 height=%2260%22/><text x=%2230%22 y=%2235%22 font-size=%2212%22 fill=%22%235c4033%22 text-anchor=%22middle%22>📷</text></svg>'">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong><br>
                        <small>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</small>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="qty-btn-remove" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toLocaleString('id-ID');
        }

        // Update quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            const product = products.find(p => p.id === productId);
            if (item) {
                if (change > 0 && product && item.quantity + change > product.stock) {
                    showNotification('⚠️ Stok ' + product.name + ' tidak mencukupi.');
                    return;
                }
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    saveCartToStorage();
                    renderCartItems();
                    updateCartDisplay();
                }
            }
        }

        // Hapus dari keranjang
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            saveCartToStorage();
            updateCartDisplay();
            renderCartItems();
        }

        function getCartTotal() {
            return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // Checkout - buka modal pilih metode pembayaran
        function checkout() {
            if (cart.length === 0) {
                alert('Keranjang kosong!');
                return;
            }
            closeCart();
            paymentModal.style.display = 'block';
            resetPaymentViews();
        }

        // semua panel di dalam modal pembayaran selain daftar metode utama
        const PAYMENT_PANEL_IDS = ['qris-display', 'ewallet-display', 'bank-display', 'payment-details-form'];

        function hideAllPaymentPanels() {
            document.getElementById('payment-methods-list').style.display = 'none';
            PAYMENT_PANEL_IDS.forEach(id => document.getElementById(id).style.display = 'none');
        }

        function resetPaymentViews() {
            hideAllPaymentPanels();
            document.getElementById('payment-methods-list').style.display = 'flex';
        }

        // tampilkan salah satu panel (qris-display/ewallet-display/dst)
        function showPaymentPanel(panelId) {
            hideAllPaymentPanels();
            document.getElementById(panelId).style.display = 'flex';
        }

        // kembali dari panel manapun ke daftar metode pembayaran utama
        function backToPaymentMethods() {
            hideAllPaymentPanels();
            document.getElementById('payment-methods-list').style.display = 'flex';
        }

        // tutup modal metode pembayaran
        function closePayment() {
            paymentModal.style.display = 'none';
            resetPaymentViews();
        }

        // COD langsung minta data pengiriman
        function selectCOD() {
            showDetailsForm('COD (Bayar di Tempat)');
        }

        // tampilkan gambar QRIS
        function showQRIS() {
            document.getElementById('qris-total').textContent = getCartTotal().toLocaleString('id-ID');
            document.getElementById('qris-order-summary').innerHTML = cart.map(item => `
                <div class="qris-summary-row">
                    <span>${item.name} x${item.quantity}</span>
                    <span>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
            `).join('');
            showPaymentPanel('qris-display');
        }

        // tampilkan pilihan E-Wallet
        function showEwallet() {
            showPaymentPanel('ewallet-display');
        }

        // tampilkan pilihan Bank
        function showBank() {
            showPaymentPanel('bank-display');
        }

        // tombol "kembali" di ketiga panel di atas semuanya melakukan hal yang sama
        const hideQRIS = backToPaymentMethods;
        const hideEwallet = backToPaymentMethods;
        const hideBank = backToPaymentMethods;

        // Konfirmasi pembayaran QRIS sudah dilakukan -> lanjut isi data
        function confirmQRISPayment() {
            showDetailsForm('QRIS');
        }

        // from data
        // daftar ID input form pembeli (dipakai untuk reset & untuk mengambil datanya)
        const BUYER_FORM_FIELDS = ['name', 'phone', 'email', 'address', 'kecamatan', 'city', 'province', 'postal', 'account', 'note'];

        function showDetailsForm(method) {
            hideAllPaymentPanels();
            currentPaymentMethod = method;
            document.getElementById('details-method-name').textContent = method;

            // reset semua field
            BUYER_FORM_FIELDS.forEach(field => {
                document.getElementById('detail-' + field).value = '';
            });

            const accountField = document.getElementById('detail-account');
            if (method.includes('COD')) {
                accountField.style.display = 'none';
            } else {
                accountField.style.display = 'block';
            }

            document.getElementById('payment-details-form').style.display = 'flex';
        }

        function hideDetailsForm() {
            document.getElementById('payment-details-form').style.display = 'none';
            // kembalikan ke daftar metode utama
            document.getElementById('payment-methods-list').style.display = 'flex';
        }

        function submitPaymentDetails() {
            const buyer = {};
            BUYER_FORM_FIELDS.forEach(field => {
                buyer[field] = document.getElementById('detail-' + field).value.trim();
            });

            if (!buyer.name || !buyer.phone || !buyer.address || !buyer.city) {
                alert('Mohon isi minimal Nama Penerima, No. HP, Alamat Lengkap, dan Kota/Kabupaten.');
                return;
            }

            finalizePurchase(currentPaymentMethod, buyer);
        }

        // setelah data pembeli lengkap, selesaikan pesanan
        function finalizePurchase(method, buyer) {
            const total = getCartTotal();
            const orderSummary = cart.map(item => `${item.name} x${item.quantity}`).join('\n');

            // mengurangi stok sesuai jumlah yang dibeli
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    product.stock = Math.max(0, product.stock - cartItem.quantity);
                }
            });
            saveProducts();

            let detailInfo = `Nama: ${buyer.name}\nNo. HP: ${buyer.phone}`;
            if (buyer.email) detailInfo += `\nEmail: ${buyer.email}`;
            detailInfo += `\nAlamat: ${buyer.address}`;
            if (buyer.kecamatan) detailInfo += `, ${buyer.kecamatan}`;
            detailInfo += `, ${buyer.city}`;
            if (buyer.province) detailInfo += `, ${buyer.province}`;
            if (buyer.postal) detailInfo += ` ${buyer.postal}`;
            if (buyer.account) detailInfo += `\nNo. Rekening/Akun Pengirim: ${buyer.account}`;
            if (buyer.note) detailInfo += `\nCatatan: ${buyer.note}`;

            alert(`🎉 Terima kasih telah berbelanja di A.G Collection!\n\nPesanan Anda:\n${orderSummary}\n\nTotal: Rp ${total.toLocaleString('id-ID')}\nMetode Pembayaran: ${method}\n\nData Pemesan:\n${detailInfo}\n\nKami akan hubungi Anda segera untuk konfirmasi!`);

            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            renderCartItems();
            closePayment();
            renderProducts();
        }

        // Notifikasi
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'toast-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // pilih mode pengguna: pembeli/admin
        function updateRoleUI() {
            const buyerLink = document.getElementById('nav-role-buyer');
            const adminLink = document.getElementById('nav-role-admin');
            const adminLabel = adminLink.querySelector('span');
            if (isAdminLoggedIn) {
                buyerLink.classList.remove('role-active');
                adminLink.classList.add('role-active');
                adminLabel.textContent = 'Admin (Kelola Stok)';
            } else {
                buyerLink.classList.add('role-active');
                adminLink.classList.remove('role-active');
                adminLabel.textContent = 'Admin';
            }
        }

        function switchToBuyerMode() {
            if (isAdminLoggedIn) {
                isAdminLoggedIn = false;
                closeAdminPanel();
                showNotification('👤 Kembali ke mode Pembeli.');
            }
            updateRoleUI();
        }

        function handleAdminNavClick() {
            if (isAdminLoggedIn) {
                openAdminPanel();
            } else {
                openAdminLogin();
            }
        }

        // admin: login
        function openAdminLogin() {
            document.getElementById('admin-username').value = '';
            document.getElementById('admin-password').value = '';
            adminLoginModal.style.display = 'block';
            setTimeout(() => document.getElementById('admin-username').focus(), 100);
        }

        function closeAdminLogin() {
            adminLoginModal.style.display = 'none';
        }

        function adminLogin() {
            const user = document.getElementById('admin-username').value.trim();
            const pass = document.getElementById('admin-password').value;

            if (!user || !pass) {
                showNotification('⚠️ Mohon isi username dan password admin.');
                return;
            }

            if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
                isAdminLoggedIn = true;
                updateRoleUI();
                closeAdminLogin();
                openAdminPanel();
                showNotification('🔑 Berhasil masuk sebagai Admin.');
            } else {
                showNotification('❌ Username atau password admin salah!');
            }
        }

        // admin: kelola stok
        function openAdminPanel() {
            if (!isAdminLoggedIn) {
                openAdminLogin();
                return;
            }
            renderAdminProducts();
            adminPanelModal.style.display = 'block';
            adminPanelModal.scrollTop = 0;
            document.body.style.overflow = 'hidden';
        }

        function closeAdminPanel() {
            adminPanelModal.style.display = 'none';
            document.body.style.overflow = '';
        }

        function adminLogout() {
            isAdminLoggedIn = false;
            updateRoleUI();
            closeAdminPanel();
            showNotification('👋 Berhasil logout dari mode admin.');
        }

        // Template form field untuk edit/tambah produk
        function productFormHTML(product, formId) {
            const p = product || { name: '', category: 'Wanita', price: '', stock: 0, image: '', description: '' };
            const categories = ['Wanita', 'Pria', 'Anak-anak', 'Unisex', 'Aksesoris'];
            const categoryOptions = categories.map(c =>
                `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c}</option>`
            ).join('');
            return `
                <div class="admin-form-fields">
                    <input type="text" id="admin-name-${formId}" placeholder="Nama Produk" value="${escapeHtml(p.name)}">
                    <div class="admin-form-row">
                        <select id="admin-category-${formId}">${categoryOptions}</select>
                        <input type="number" id="admin-price-${formId}" placeholder="Harga (Rp)" min="0" value="${p.price}">
                    </div>
                    <div class="admin-form-row">
                        <input type="number" id="admin-stock-${formId}" placeholder="Stok" min="0" value="${p.stock}">
                        <input type="text" id="admin-image-${formId}" placeholder="Path/URL Gambar (mis. image/nama.jpg)" value="${escapeHtml(p.image)}">
                    </div>
                    <textarea id="admin-desc-${formId}" placeholder="Deskripsi produk" rows="2">${escapeHtml(p.description)}</textarea>
                </div>
            `;
        }

// Ikon kategori untuk avatar produk di panel admin
        function getCategoryIcon(category) {
            const icons = {
                'Wanita': 'fa-female',
                'Pria': 'fa-male',
                'Anak-anak': 'fa-child',
                'Unisex': 'fa-users',
                'Aksesoris': 'fa-crown'
            };
            return icons[category] || 'fa-tshirt';
        }

        function renderAdminProducts() {
            const container = document.getElementById('admin-products-list');
            container.innerHTML = products.map(product => `
                <div class="admin-product-row">
                    <div class="admin-product-main">
                        <div class="admin-avatar">
                            <i class="fas ${getCategoryIcon(product.category)}"></i>
                        </div>
                        <div class="admin-info">
                            <strong class="admin-product-name">${escapeHtml(product.name)}</strong>
                            <small class="admin-product-meta">${escapeHtml(product.category)} • Rp ${product.price.toLocaleString('id-ID')}</small>
                        </div>
                        <div class="admin-stock-badge">
                            <i class="far fa-calendar-alt"></i> Stok: ${product.stock}
                        </div>
                        <div class="admin-controls">
                            <button class="admin-icon-btn admin-step-btn" onclick="adminStepQty(${product.id}, -1)" title="Kurangi jumlah"><i class="fas fa-minus"></i></button>
                            <input type="number" id="admin-qty-${product.id}" class="admin-qty-input" min="1" value="1" placeholder="Jml">
                            <button class="admin-icon-btn admin-step-btn" onclick="adminStepQty(${product.id}, 1)" title="Tambah jumlah"><i class="fas fa-plus"></i></button>
                            <button class="admin-icon-btn admin-reduce-btn" onclick="adminReduceStock(${product.id})" title="Kurangi stok"><i class="fas fa-minus-circle"></i></button>
                            <button class="admin-icon-btn admin-edit-btn" onclick="toggleEditProduct(${product.id})" title="Edit produk"><i class="fas fa-pen"></i></button>
                            <button class="admin-icon-btn admin-delete-btn" onclick="adminDeleteProduct(${product.id})" title="Hapus produk"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="admin-edit-panel" id="admin-edit-${product.id}" style="display:none;">
                        ${productFormHTML(product, product.id)}
                        <div class="admin-form-actions">
                            <button class="btn-save-product" onclick="adminSaveProduct(${product.id})"><i class="fas fa-check"></i> Simpan Perubahan</button>
                            <button class="btn-cancel-edit" onclick="toggleEditProduct(${product.id})">Batal</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Tombol +/- di sebelah input Jml: mengubah angka jumlah yang akan dipakai untuk mengurangi stok
        function adminStepQty(productId, delta) {
            const input = document.getElementById('admin-qty-' + productId);
            if (!input) return;
            const current = parseInt(input.value, 10) || 1;
            const next = Math.max(1, current + delta);
            input.value = next;
        }

        // Buka/tutup form edit satu produk (accordion: tutup form lain yang terbuka)
        function toggleEditProduct(id) {
            const panel = document.getElementById('admin-edit-' + id);
            if (!panel) return;
            const isOpening = panel.style.display === 'none' || panel.style.display === '';

            document.querySelectorAll('.admin-edit-panel').forEach(el => el.style.display = 'none');
            const newFormPanel = document.getElementById('admin-new-product-form');
            if (newFormPanel) {
                newFormPanel.style.display = 'none';
                newFormPanel.innerHTML = '';
            }

            if (isOpening) {
                panel.style.display = 'block';
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        // Ambil nilai form admin (dipakai bareng oleh simpan-edit & tambah-baru)
        function getAdminFormData(formId) {
            return {
                name: document.getElementById('admin-name-' + formId).value.trim(),
                category: document.getElementById('admin-category-' + formId).value,
                price: parseInt(document.getElementById('admin-price-' + formId).value, 10),
                stock: parseInt(document.getElementById('admin-stock-' + formId).value, 10),
                image: document.getElementById('admin-image-' + formId).value.trim(),
                description: document.getElementById('admin-desc-' + formId).value.trim()
            };
        }

        // Validasi form admin. Saat bikin produk baru, stok kosong dianggap 0 (bukan error).
        function validateAdminForm(data, { requireStock = true } = {}) {
            if (!data.name) {
                showNotification('⚠️ Nama produk tidak boleh kosong.');
                return false;
            }
            if (isNaN(data.price) || data.price < 0) {
                showNotification('⚠️ Harga tidak valid.');
                return false;
            }
            if (requireStock && (isNaN(data.stock) || data.stock < 0)) {
                showNotification('⚠️ Stok tidak valid.');
                return false;
            }
            return true;
        }

        // Simpan perubahan hasil edit produk
        function adminSaveProduct(id) {
            const data = getAdminFormData(id);
            if (!validateAdminForm(data)) return;

            const product = products.find(p => p.id === id);
            if (!product) return;

            product.name = data.name;
            product.category = data.category;
            product.price = data.price;
            product.stock = data.stock;
            if (data.image) product.image = data.image;
            product.description = data.description || 'Deskripsi belum tersedia.';

            saveProducts();
            renderAdminProducts();
            renderProducts();
            showNotification('✅ Produk "' + data.name + '" berhasil diperbarui.');
        }

        // Hapus produk
        function adminDeleteProduct(id) {
            const product = products.find(p => p.id === id);
            if (!product) return;
            if (!confirm('Yakin ingin menghapus produk "' + product.name + '"? Tindakan ini tidak bisa dibatalkan.')) {
                return;
            }
            products = products.filter(p => p.id !== id);
            saveProducts();
            renderAdminProducts();
            renderProducts();
            showNotification('🗑️ Produk "' + product.name + '" telah dihapus.');
        }

        // Buka/tutup form tambah produk baru
        function toggleNewProductForm() {
            const panel = document.getElementById('admin-new-product-form');
            const isOpening = panel.style.display === 'none' || panel.style.display === '';

            if (isOpening) {
                document.querySelectorAll('.admin-edit-panel').forEach(el => el.style.display = 'none');
                panel.innerHTML = productFormHTML(null, 'new') + `
                    <div class="admin-form-actions">
                        <button class="btn-save-product" onclick="adminCreateProduct()"><i class="fas fa-check"></i> Simpan Produk Baru</button>
                        <button class="btn-cancel-edit" onclick="toggleNewProductForm()">Batal</button>
                    </div>
                `;
                panel.style.display = 'block';
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                panel.style.display = 'none';
                panel.innerHTML = '';
            }
        }

        // Buat produk baru
        function adminCreateProduct() {
            const data = getAdminFormData('new');
            if (!validateAdminForm(data, { requireStock: false })) return;

            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({
                id: newId,
                name: data.name,
                category: data.category,
                price: data.price,
                stock: isNaN(data.stock) ? 0 : data.stock,
                image: data.image || 'image/placeholder.jpg',
                description: data.description || 'Deskripsi belum tersedia.'
            });

            saveProducts();
            toggleNewProductForm();
            renderAdminProducts();
            renderProducts();
            showNotification('✅ Produk "' + data.name + '" berhasil ditambahkan.');
        }

        // direction: 1 untuk tambah stok, -1 untuk kurangi stok
        function adminAdjustStock(productId, direction) {
            const input = document.getElementById('admin-qty-' + productId);
            const qty = parseInt(input.value, 10);
            if (isNaN(qty) || qty <= 0) {
                showNotification('⚠️ Masukkan jumlah yang valid.');
                return;
            }
            const product = products.find(p => p.id === productId);
            if (!product) return;

            product.stock = direction > 0 ? product.stock + qty : Math.max(0, product.stock - qty);
            saveProducts();
            renderAdminProducts();
            renderProducts();
            const verb = direction > 0 ? 'ditambah' : 'dikurangi';
            showNotification('✅ Stok ' + product.name + ' ' + verb + ' ' + qty + '.');
        }

        function adminAddStock(productId) {
            adminAdjustStock(productId, 1);
        }

        function adminReduceStock(productId) {
            adminAdjustStock(productId, -1);
        }

        // Interaksi pengguna
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts();
            updateCartDisplay();
            updateRoleUI();

            // Tutup Modal Saat Klik di Luar
            window.onclick = function(event) {
                if (event.target == modal) {
                    closeCart();
                }
                if (event.target == paymentModal) {
                    closePayment();
                }
                if (event.target == productDetailModal) {
                    closeProductDetail();
                }
                if (event.target == adminLoginModal) {
                    closeAdminLogin();
                }
                if (event.target == adminPanelModal) {
                    closeAdminPanel();
                }
            };
        });