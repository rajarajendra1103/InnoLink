import { db, storage } from '../firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    setDoc,
    query,
    where,
    orderBy,
    increment,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- GENERIC POST HELPERS ---

const uploadMedia = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// --- IDEA REGISTRATION ---

export const createIdeaRegistration = async (registrationData) => {
    const docRef = await addDoc(collection(db, 'ideaRegistrations'), {
        ...registrationData,
        createdAt: serverTimestamp(),
        expiryDate: new Date(Date.now() + (parseInt(registrationData.lockDuration) * 24 * 60 * 60 * 1000)),
        status: 'locked'
    });
    return docRef.id;
};

// --- PROBLEMS ---

export const createProblem = async (problemData, mediaFiles = []) => {
    const mediaUrls = await Promise.all(mediaFiles.map(file => uploadMedia(file, 'problems')));

    const docRef = await addDoc(collection(db, 'problems'), {
        ...problemData,
        media: mediaUrls,
        type: 'Problem',
        createdAt: serverTimestamp(),
        engagement: { likes: 0, comments: 0 },
        status: 'published' // Lifecycle: draft, published, archived, flagged
    });
    return docRef.id;
};

export const getProblems = async () => {
    const q = query(collection(db, 'problems'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- IDEAS ---

export const createIdea = async (ideaData, mediaFiles = []) => {
    const mediaUrls = await Promise.all(mediaFiles.map(file => uploadMedia(file, 'ideas')));

    // Status can be: 'registered' (temporary), 'published'
    const docRef = await addDoc(collection(db, 'ideas'), {
        ...ideaData,
        media: mediaUrls,
        type: 'Idea',
        createdAt: serverTimestamp(),
        engagement: { likes: 0, comments: 0 },
        status: ideaData.status || 'published'
    });
    return docRef.id;
};

export const getIdeas = async () => {
    const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- SOLUTIONS ---

export const createSolution = async (solutionData, mediaFiles = []) => {
    const mediaUrls = await Promise.all(mediaFiles.map(file => uploadMedia(file, 'solutions')));

    const docRef = await addDoc(collection(db, 'solutions'), {
        ...solutionData,
        media: mediaUrls,
        type: 'Solution',
        createdAt: serverTimestamp(),
        engagement: { likes: 0, comments: 0 },
    });
    return docRef.id;
};

// --- ENGAGEMENT (Likes/Comments) ---

export const toggleLike = async (postId, postType, userId, isLiked) => {
    const postRef = doc(db, postType.toLowerCase() + 's', postId);
    await updateDoc(postRef, {
        'engagement.likes': increment(isLiked ? -1 : 1)
    });

    // Track in a separate likes collection for user-specific history
    const likeRef = doc(db, 'likes', `${userId}_${postId}`);
    if (isLiked) {
        await deleteDoc(likeRef);
    } else {
        await setDoc(likeRef, { userId, postId, createdAt: serverTimestamp() });
    }
};

export const addComment = async (postId, postType, commentData) => {
    const commentRef = await addDoc(collection(db, 'comments'), {
        postId,
        postType,
        ...commentData,
        createdAt: serverTimestamp()
    });

    const postRef = doc(db, postType.toLowerCase() + 's', postId);
    await updateDoc(postRef, {
        'engagement.comments': increment(1)
    });

    return commentRef.id;
};

// --- POLLS ---

export const createPoll = async (pollData) => {
    const docRef = await addDoc(collection(db, 'polls'), {
        ...pollData,
        createdAt: serverTimestamp(),
        voters: []
    });
    return docRef.id;
};

export const voteInPoll = async (pollId, userId, optionIndex) => {
    const pollRef = doc(db, 'polls', pollId);
    // Note: This is simplified. Real-time aggregation might need a subcollection if scale is huge.
    // But for MVP, we can use array or just another collection.
    await addDoc(collection(db, 'votes'), {
        pollId,
        userId,
        optionIndex,
        createdAt: serverTimestamp()
    });

    await updateDoc(pollRef, {
        voters: arrayUnion(userId)
    });
};

// --- MODERATION ---

export const reportContent = async (contentId, contentType, reason, userId) => {
    await addDoc(collection(db, 'violations'), {
        contentId,
        contentType,
        reason,
        reportedBy: userId,
        status: 'pending',
        createdAt: serverTimestamp()
    });

    // Auto-flagging logic can be handled by Cloud Functions or here for MVP
    // For now, just mark the content as potentially flagged?
};
