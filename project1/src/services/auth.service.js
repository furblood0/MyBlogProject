import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

class AuthService {
    // Mevcut: Kayıt
    async register(username, email, password) {
        try {
            const response = await axios.post(API_URL + 'register', {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Kayıt başarısız oldu.';
        }
    }

    // GÜNCELLENECEK: Giriş
    async login(email, password) {
        try {
            const response = await axios.post(API_URL + 'login', {
                email,
                password,
            });

            if (response.data.token) {
                // Sadece token'ı ve kullanıcı objesini ayrı ayrı sakla
                localStorage.setItem('user', JSON.stringify(response.data.user)); // user objesini kaydet
                localStorage.setItem('token', response.data.token); // token'ı kaydet
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Giriş başarısız oldu.';
        }
    }

    // Mevcut: Çıkış
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Token'ı da sil
    }

    // GÜNCELLENECEK: Mevcut Kullanıcı Bilgilerini Getir
    getCurrentUser() {
        // Hem kullanıcı objesini hem de token'ı döndürelim
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            return { ...JSON.parse(user), token }; // user objesini token ile birleştirip döndür
        }
        return null;
    }

    // GÜNCELLENECEK: Kullanıcı profili ve yazılarını getir
    async getUserProfileAndPosts(userId) {
        const user = this.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.get(
                API_URL + `users/${user.id}/profile`, // <-- Backend'deki yeni rota ile eşleşti
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Profil bilgileri yüklenemedi.';
        }
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;