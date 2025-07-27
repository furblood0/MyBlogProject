import axios from 'axios';
import authService from './auth.service'; // authService'i kullanmaya devam ediyoruz

const API_URL = 'http://localhost:5000/api/';

class PostService {
    // Mevcut: Yeni yazı oluşturma
    async createPost(title, content, excerpt, imageUrl, published) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.post(
                API_URL + 'posts',
                { title, content, excerpt, imageUrl, published },
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            // Backend'den gelen hata mesajını daha iyi yakalamak için
            throw error.response?.data?.message || error.message || 'Yazı oluşturma başarısız oldu.';
        }
    }

    // Mevcut: Tüm yazıları getir (Ana Sayfa için)
    async getAllPosts() {
        try {
            const response = await axios.get(API_URL + 'posts');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazılar yüklenemedi.';
        }
    }

    // GÜNCELLENECEK: Tek bir yazıyı ID'ye göre getir
    async getPostById(id) {
        // authService.getCurrentUser() çağrısıyla token'ı alıyoruz.
        // Eğer kullanıcı giriş yapmamışsa, token null olacaktır.
        // Bu durumda headers objesi boş olur, yine de istek gönderilir.
        // Backend'deki authOptional middleware'ı bu durumu ele alır.
        const user = authService.getCurrentUser();
        const headers = user && user.token ? { 'x-auth-token': user.token } : {};

        try {
            const response = await axios.get(API_URL + `posts/${id}`, { headers });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazı bulunamadı veya yüklenemedi.';
        }
    }

    // YENİ EKLENECEK: Blog Yazısı Güncelleme
    async updatePost(id, title, content, excerpt, imageUrl, published) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.put(
                API_URL + `posts/${id}`,
                { title, content, excerpt, imageUrl, published },
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazı güncelleme başarısız oldu.';
        }
    }

    // YENİ EKLENECEK: Blog Yazısı Silme
    async deletePost(id) {
        const user = authService.getCurrentUser();
        if (!user || !user.token) {
            throw new Error('Giriş yapmalısınız.');
        }

        try {
            const response = await axios.delete(
                API_URL + `posts/${id}`,
                {
                    headers: {
                        'x-auth-token': user.token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message || 'Yazı silme başarısız oldu.';
        }
    }
}

const postServiceInstance = new PostService();
export default postServiceInstance;