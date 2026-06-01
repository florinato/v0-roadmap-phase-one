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
  collectionGroup,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import { mockProducts, mockSellers, mockConversations, mockUserReviews } from '@/lib/mockData';

// ============================================
// PRODUCTOS
// ============================================

/**
 * Obtiene todos los productos activos
 */
export async function getProducts() {
  try {
    // Usar mockData si Firebase no está configurado
    if (!isFirebaseConfigured) {
      console.log('[v0] Using mockData for products (Firebase not configured)');
      return mockProducts.filter(p => p.state === 'active').map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        images: [p.imageUrl],
        category: p.course.toLowerCase(),
        state: p.state,
        description: p.description,
        sellerId: p.sellerId,
      }));
    }

    const q = query(
      collection(db, 'products'),
      where('state', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[v0] Error fetching products:', error);
    // Fallback a mockData en caso de error
    return mockProducts.filter(p => p.state === 'active').map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      images: [p.imageUrl],
      category: p.course.toLowerCase(),
      state: p.state,
      description: p.description,
      sellerId: p.sellerId,
    }));
  }
}

/**
 * Obtiene un producto específico por ID
 */
export async function getProductById(productId) {
  try {
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

/**
 * Obtiene productos del vendedor (inventario)
 */
export async function getUserProducts(userId) {
  try {
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

/**
 * Crea un producto nuevo
 */
export async function addProduct(productData) {
  try {
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

/**
 * Actualiza el estado del producto (active -> reserved -> sold)
 */
export async function updateProductState(productId, newState, buyerId = null) {
  try {
    const docRef = doc(db, 'products', productId);
    const updateData = { state: newState };

    if (newState === 'reserved') {
      updateData.reservedBy = buyerId;
    } else if (newState === 'sold') {
      updateData.soldTo = buyerId;
    }

    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('[v0] Error updating product state:', error);
    throw error;
  }
}

/**
 * Elimina un producto
 */
export async function deleteProduct(productId) {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[v0] Error deleting product:', error);
    throw error;
  }
}

// ============================================
// USUARIOS
// ============================================

/**
 * Obtiene datos del usuario
 */
export async function getUserData(userId) {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('[v0] Error fetching user:', error);
    return null;
  }
}

/**
 * Crea o actualiza el perfil del usuario
 */
export async function updateUserProfile(userId, profileData) {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, profileData);
    return true;
  } catch (error) {
    console.error('[v0] Error updating user profile:', error);
    throw error;
  }
}

// ============================================
// MENSAJES / CHATS
// ============================================

/**
 * Obtiene o crea una conversación entre dos usuarios
 */
export async function getOrCreateConversation(productId, sellerId, buyerId) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('productId', '==', productId),
      where('participants', 'array-contains', buyerId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }

    // Crear nueva conversación
    const docRef = await addDoc(collection(db, 'chats'), {
      productId,
      participants: [sellerId, buyerId],
      lastMessage: '',
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('[v0] Error getting/creating conversation:', error);
    throw error;
  }
}

/**
 * Obtiene los chats del usuario
 */
export async function getUserChats(userId) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const chats = await Promise.all(
      querySnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        // Obtener el producto para cada chat
        const productDoc = await getDoc(doc(db, 'products', chatData.productId));
        const product = productDoc.exists() ? productDoc.data() : null;

        return {
          id: chatDoc.id,
          ...chatData,
          product,
        };
      })
    );
    return chats;
  } catch (error) {
    console.error('[v0] Error fetching user chats:', error);
    return [];
  }
}

/**
 * Obtiene mensajes de una conversación
 */
export async function getConversationMessages(conversationId) {
  try {
    const q = query(
      collection(db, 'chats', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
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

/**
 * Envía un mensaje en una conversación
 */
export async function sendMessage(conversationId, senderId, content) {
  try {
    const messageRef = await addDoc(
      collection(db, 'chats', conversationId, 'messages'),
      {
        senderId,
        content,
        createdAt: serverTimestamp(),
        readAt: null,
      }
    );

    // Actualizar lastMessage en el chat
    await updateDoc(doc(db, 'chats', conversationId), {
      lastMessage: content,
      updatedAt: serverTimestamp(),
    });

    return messageRef.id;
  } catch (error) {
    console.error('[v0] Error sending message:', error);
    throw error;
  }
}

// ============================================
// RESEÑAS
// ============================================

/**
 * Obtiene reseñas recibidas por un usuario
 */
export async function getUserReviews(userId) {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const reviews = await Promise.all(
      querySnapshot.docs.map(async (reviewDoc) => {
        const reviewData = reviewDoc.data();
        // Obtener datos del revisor
        const reviewerDoc = await getDoc(doc(db, 'users', reviewData.fromUserId));
        const reviewer = reviewerDoc.exists() ? reviewerDoc.data() : null;

        return {
          id: reviewDoc.id,
          ...reviewData,
          reviewer,
        };
      })
    );
    return reviews;
  } catch (error) {
    console.error('[v0] Error fetching reviews:', error);
    return [];
  }
}

/**
 * Crea una nueva reseña
 */
export async function createReview(reviewData) {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp(),
    });

    // Actualizar rating del usuario
    const userRef = doc(db, 'users', reviewData.toUserId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentReviews = userSnap.data().reviewsCount || 0;
      const currentRating = userSnap.data().rating || 0;
      const newReviewsCount = currentReviews + 1;
      const newRating = (currentRating * currentReviews + reviewData.rating) / newReviewsCount;

      await updateDoc(userRef, {
        reviewsCount: newReviewsCount,
        rating: parseFloat(newRating.toFixed(1)),
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('[v0] Error creating review:', error);
    throw error;
  }
}

// ============================================
// ALMACENAMIENTO (Storage)
// ============================================

/**
 * Sube una imagen a Firebase Storage
 */
export async function uploadImage(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('[v0] Error uploading image:', error);
    throw error;
  }
}

/**
 * Sube múltiples imágenes y retorna URLs
 */
export async function uploadImages(files, productId) {
  try {
    const imageUrls = await Promise.all(
      files.map((file, index) =>
        uploadImage(file, `products/${productId}/image_${index}_${Date.now()}`)
      )
    );
    return imageUrls;
  } catch (error) {
    console.error('[v0] Error uploading images:', error);
    throw error;
  }
}

/**
 * Elimina una imagen de Firebase Storage
 */
export async function deleteImage(imageUrl) {
  try {
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.error('[v0] Error deleting image:', error);
    throw error;
  }
}
