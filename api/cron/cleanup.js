import { list, del } from '@vercel/blob';

/**
 * Vercel Cron Job: Cleanup expired blobs
 * Runs every minute to actively delete files past their expiration time
 */
export default async function handler(req, res) {
  // Verify this is a cron request (Vercel adds this header)
  const authHeader = req.headers.authorization;

  // In production, Vercel cron jobs include Authorization header
  // For development/testing, we'll allow requests without it
  if (process.env.VERCEL_ENV === 'production' && !authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = Date.now();
    let deletedCount = 0;
    let checkedCount = 0;
    const errors = [];

    // List all blobs in the store
    const { blobs } = await list();

    console.log(`[Cleanup] Checking ${blobs.length} blobs for expiration`);

    // Check each blob for expiration
    for (const blob of blobs) {
      checkedCount++;

      try {
        // Get expiration time from blob metadata
        let expirationTime;

        if (blob.metadata && blob.metadata.expiresAt) {
          // Use stored expiration timestamp from metadata
          expirationTime = parseInt(blob.metadata.expiresAt, 10);
        } else if (blob.uploadedAt) {
          // Fallback: calculate from uploadedAt if metadata missing
          const uploadedAtTime = new Date(blob.uploadedAt).getTime();
          expirationTime = uploadedAtTime + (60 * 1000); // 60 seconds
        } else {
          // Skip blobs without proper timestamp data
          console.warn(`[Cleanup] Skipping blob without timestamp: ${blob.pathname}`);
          continue;
        }

        // Delete if expired
        if (now >= expirationTime) {
          console.log(`[Cleanup] Deleting expired blob: ${blob.pathname} (expired at ${new Date(expirationTime).toISOString()})`);
          await del(blob.url);
          deletedCount++;
        } else {
          const secondsRemaining = Math.round((expirationTime - now) / 1000);
          console.log(`[Cleanup] Blob ${blob.pathname} expires in ${secondsRemaining}s`);
        }
      } catch (error) {
        console.error(`[Cleanup] Error processing blob ${blob.pathname}:`, error);
        errors.push({
          pathname: blob.pathname,
          error: error.message
        });
      }
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      checked: checkedCount,
      deleted: deletedCount,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('[Cleanup] Completed:', result);

    return res.status(200).json(result);
  } catch (error) {
    console.error('[Cleanup] Fatal error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
