import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { db, storage, auth, isConfigured } from './firebase';
import { mockProducts, mockSellers, mockConversations, mockUserReviews } from '@/lib/mockData';

// ============================================
// AUTENTICACIÓN
// ============================================

export async function signupWithEmail(name, email, password) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Firebase not configured, using mock signup');
      const mockUser = {
        uid: 'mock-' + Date.now(),
        email,
        displayName: name,
      };
      localStorage.setItem('escolarapp_firebase_user', JSON.stringify(mockUser));
      return mockUser;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userData = {
      uid: firebaseUser.uid,
      name,
      email,
      rating: 5.0,
      reviewsCount: 0,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      createdAt: serverTimestamp(),
      bio: '',
    };

    await addDoc(collection(db, 'users'), userData);
    return firebaseUser;
  } catch (error) {
    console.error('[v0] Signup error:', error);
    throw new Error(error.message);
  }
}

export async function loginWithEmail(email, password) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Firebase not configured, using mock login');
      const mockUser = {
        uid: 'mock-user',
        email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('escolarapp_firebase_user', JSON.stringify(mockUser));
      return mockUser;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('[v0] Login error:', error);
    throw new Error(error.message);
  }
}

export async function logoutUser() {
  try {
    if (!isConfigured()) {
      localStorage.removeItem('escolarapp_firebase_user');
      return;
    }
    await signOut(auth);
  } catch (error) {
    console.error('[v0] Logout error:', error);
  }
}

export async function getCurrentUserData(uid) {
  try {
    if (!isConfigured()) return null;

    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error('[v0] Error fetching user data:', error);
    return null;
  }
}

// ============================================
// PRODUCTOS
// ============================================

export async function getProducts(categoryFilter = null) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Using mockData for products');
      return mockProducts.filter(p => p.state === 'active').map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        images: [p.imageUrl],
        category: p.course.toLowerCase(),
        state: p.state,
        description: p.description,
        sellerId: p.sellerId,
        createdAt: new Date(),
      }));
    }

    const constraints = [where('state', '==', 'active')];
    if (categoryFilter) {
      constraints.push(where('category', '==', categoryFilter));
    }
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, 'products'), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching products:', error);
    return [];
  }
}

export async function getProductById(productId) {
  try {
    if (!isConfigured()) {
      const product = mockProducts.find(p => p.id === productId);
      return product ? { id: product.id, ...product } : null;
    }

    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('[v0] Error fetching product:', error);
    return null;
  }
}

export async function getUserProducts(userId) {
  try {
    if (!isConfigured()) {
      return mockProducts.filter(p => p.sellerId === userId).map(p => ({
        id: p.id,
        ...p,
      }));
    }

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching user products:', error);
    return [];
  }
}

export async function addProduct(productData) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock product creation');
      return {
        id: 'mock-' + Date.now(),
        ...productData,
        createdAt: new Date(),
      };
    }

    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp(),
      views: 0,
      state: 'active',
    });

    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('[v0] Error adding product:', error);
    throw error;
  }
}

export async function updateProductState(productId, newState) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock product state update:', newState);
      return true;
    }

    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      state: newState,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('[v0] Error updating product state:', error);
    return false;
  }
}

export async function deleteProduct(productId) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock product deletion');
      return true;
    }

    await deleteDoc(doc(db, 'products', productId));
    return true;
  } catch (error) {
    console.error('[v0] Error deleting product:', error);
    return false;
  }
}

// ============================================
// MENSAJES Y CONVERSACIONES
// ============================================

export async function getConversations(userId) {
  try {
    if (!isConfigured()) {
      return mockConversations.map(c => ({
        id: c.id,
        productId: c.productId,
        sellerId: c.sellerId,
        lastMessage: c.lastMessage,
        lastMessageTime: c.lastMessageTime,
      }));
    }

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching conversations:', error);
    return [];
  }
}

export async function getConversationMessages(conversationId) {
  try {
    if (!isConfigured()) {
      const conv = mockConversations.find(c => c.id === conversationId);
      return conv ? conv.messages : [];
    }

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching messages:', error);
    return [];
  }
}

export async function sendMessage(conversationId, senderId, text) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock message sent');
      return {
        id: 'mock-' + Date.now(),
        conversationId,
        senderId,
        text,
        timestamp: new Date(),
        read: false,
      };
    }

    const messageRef = await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId,
      text,
      timestamp: serverTimestamp(),
      read: false,
    });

    // Actualizar última vez que se escribió en la conversación
    const convRef = doc(db, 'conversations', conversationId);
    await updateDoc(convRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
    });

    return { id: messageRef.id, conversationId, senderId, text, timestamp: new Date() };
  } catch (error) {
    console.error('[v0] Error sending message:', error);
    throw error;
  }
}

export async function createOrGetConversation(userId, sellerId, productId) {
  try {
    if (!isConfigured()) {
      const mockConv = mockConversations.find(c => c.productId === productId);
      return mockConv || {
        id: 'mock-conv-' + Date.now(),
        productId,
        sellerId,
        participants: [userId, sellerId],
      };
    }

    // Buscar conversación existente
    const q = query(
      collection(db, 'conversations'),
      where('productId', '==', productId),
      where('participants', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }

    // Crear conversación nueva
    const convRef = await addDoc(collection(db, 'conversations'), {
      productId,
      sellerId,
      participants: [userId, sellerId],
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
    });

    return { id: convRef.id, productId, sellerId, participants: [userId, sellerId] };
  } catch (error) {
    console.error('[v0] Error creating conversation:', error);
    throw error;
  }
}

// ============================================
// RESEÑAS
// ============================================

export async function getUserReviews(userId) {
  try {
    if (!isConfigured()) {
      return mockUserReviews.map(r => ({
        id: r.id,
        ...r,
      }));
    }

    const q = query(
      collection(db, 'reviews'),
      where('revieweeId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching reviews:', error);
    return [];
  }
}

export async function createReview(reviewData) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock review created');
      return {
        id: 'mock-' + Date.now(),
        ...reviewData,
        createdAt: new Date(),
      };
    }

    const reviewRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
    });

    // Actualizar rating del usuario
    const userQ = query(collection(db, 'users'), where('uid', '==', reviewData.revieweeId));
    const userSnap = await getDocs(userQ);
    if (!userSnap.empty) {
      const userDocId = userSnap.docs[0].id;
      const currentReviewsCount = userSnap.docs[0].data().reviewsCount || 0;
      const currentRating = userSnap.docs[0].data().rating || 5;

      const newReviewsCount = currentReviewsCount + 1;
      const newRating = ((currentRating * currentReviewsCount) + reviewData.rating) / newReviewsCount;

      await updateDoc(doc(db, 'users', userDocId), {
        rating: newRating,
        reviewsCount: newReviewsCount,
      });
    }

    return { id: reviewRef.id, ...reviewData };
  } catch (error) {
    console.error('[v0] Error creating review:', error);
    throw error;
  }
}

// ============================================
// TRANSACCIONES
// ============================================

export async function getUserTransactions(userId) {
  try {
    if (!isConfigured()) {
      return [];
    }

    const buyerQ = query(
      collection(db, 'transactions'),
      where('buyerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const sellerQ = query(
      collection(db, 'transactions'),
      where('sellerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const [buyerSnap, sellerSnap] = await Promise.all([
      getDocs(buyerQ),
      getDocs(sellerQ),
    ]);

    const transactions = [
      ...buyerSnap.docs.map(doc => ({ id: doc.id, type: 'bought', ...doc.data() })),
      ...sellerSnap.docs.map(doc => ({ id: doc.id, type: 'sold', ...doc.data() })),
    ];

    return transactions.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('[v0] Error fetching transactions:', error);
    return [];
  }
}

export async function createTransaction(transactionData) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock transaction created');
      return {
        id: 'mock-' + Date.now(),
        ...transactionData,
        createdAt: new Date(),
      };
    }

    const transRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: serverTimestamp(),
      status: 'completed',
    });

    return { id: transRef.id, ...transactionData };
  } catch (error) {
    console.error('[v0] Error creating transaction:', error);
    throw error;
  }
}

// ============================================
// NOTIFICACIONES
// ============================================

export async function createNotification(notificationData) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock notification created');
      return true;
    }

    await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      createdAt: serverTimestamp(),
      read: false,
    });

    return true;
  } catch (error) {
    console.error('[v0] Error creating notification:', error);
    return false;
  }
}

export async function getUserNotifications(userId) {
  try {
    if (!isConfigured()) return [];

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    if (!isConfigured()) return true;

    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
    });
    return true;
  } catch (error) {
    console.error('[v0] Error marking notification as read:', error);
    return false;
  }
}

// ============================================
// IMAGENES
// ============================================

export async function uploadImages(files, userId) {
  try {
    if (!isConfigured()) {
      console.log('[v0] Mock image upload');
      // Generar URLs fake para desarrollo
      return files.map((_, index) => `https://via.placeholder.com/300x300?text=Product+${index + 1}`);
    }

    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const filename = `${userId}/${timestamp}-${index}-${file.name}`;
      const storageRef = ref(storage, `products/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('[v0] Error uploading images:', error);
    return [];
  }
}

export async function deleteImage(imagePath) {
  try {
    if (!isConfigured()) return true;

    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('[v0] Error deleting image:', error);
    return false;
  }
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

export async function searchProducts(searchTerm, categoryFilter = null) {
  try {
    if (!isConfigured()) {
      return mockProducts
        .filter(p => p.state === 'active')
        .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          images: [p.imageUrl],
          category: p.course.toLowerCase(),
        }));
    }

    // Firebase no tiene búsqueda full-text nativa, usar Algolia o similar en producción
    const allProducts = await getProducts(categoryFilter);
    return allProducts.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('[v0] Error searching products:', error);
    return [];
  }
}

export { auth, db, storage };
