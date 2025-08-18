import { setGlobalOptions } from 'firebase-functions';
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { generateOgImage } from './utils/generateOgImage';

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();
const db = admin.firestore();

exports.createNewUserDocument = functions
  .runWith({ maxInstances: 10 })
  .auth.user()
  .onCreate(async (user) => {
    const userRef = db.collection('users').doc(user.uid);

    try {
      await userRef.set({
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`User document created for ${user.uid}`);
    } catch (error) {
      console.error(`Error creating user document for ${user.uid}:`, error);
    }
  });

exports.onTestCompleted = functions
  .runWith({ maxInstances: 10 })
  .firestore.document('users/{userId}/testResults/{testId}')
  .onCreate(async (snapshot, context) => {
    const { userId, testId } = context.params;
    const testResultData = snapshot.data();

    const userRef = db.doc(`users/${userId}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return;

    const userData = userSnap.data();

    const statData = {
      timeSpent: testResultData.timeSpent,
      score: testResultData.score,
      date: testResultData.date,
      age: userData?.age,
      gender: userData?.gender,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('statistics').doc(testId).set(statData);
  });

exports.createOgImage = functions
  .runWith({ memory: '1GB', timeoutSeconds: 60, maxInstances: 10 })
  .firestore.document('statistics/{id}')
  .onCreate(async (snapshot, context) => {
    const resultData = snapshot.data() as any;
    const resultId = context.params.id;

    if (!resultData || !resultId) return;

    // Generate image
    const imageBuffer = await generateOgImage(resultData);
    if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
      throw new Error('Failed to generate image buffer.');
    }

    // Upload to Firebase Storage
    const file = admin.storage().bucket().file(`og-images/${resultId}.png`);

    await file.save(imageBuffer, {
      contentType: 'image/png',
      public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
  });
