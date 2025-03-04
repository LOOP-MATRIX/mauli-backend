const cron = require('node-cron');
const batchSchema = require('../models/batch');
const videoSchema= require('../models/video');

cron.schedule("0 0 * * *", async () => {
    console.log("cron running every 5 minutes");
    try {
        console.log("Running batch video access update...");

        const batch = await batchSchema.find({ batchStatus: "ongoing" });

        if (batch.length === 0) {
            console.log('No ongoing batches found.');
            return;
        }

        for (const b of batch) {
            const videos = await videoSchema.find({ courseId: b.courseID });

            if (videos.length === 0) {
                console.log(`No videos uploaded yet for batch ${b.name}`);
                continue;
            }

            if (b.batchStatus === "completed") {
                console.log(`Batch ${b.name} is already completed.`);
                continue;
            }

            // Ensure video access does not exceed the total videos
            if (b.currentVideoAccess <= videos.length) {
                b.currentVideoAccess += 1;
            }

            // Mark batch as completed when all videos are accessed
            if (b.currentVideoAccess == videos.length) {
                b.batchStatus = "completed";
            }

            await b.save();
            console.log(`Updated batch ${b.name}: currentVideoAccess = ${b.currentVideoAccess}, batchStatus = ${b.batchStatus}`);
        }
    } catch (error) {
        console.error("Error updating batch video access:", error);
    }
});

module.exports = cron;