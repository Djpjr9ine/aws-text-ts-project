const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const polly = new PollyClient({});
const s3 = new S3Client({ region: "us-east-2" }); // ✅ Set to your S3 bucket's region

exports.handler = async (event) => {
    try {
        const text = event.text;

        const params = {
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Joanna",
        };

        const command = new SynthesizeSpeechCommand(params);
        const data = await polly.send(command);

        const key = `audio-${Date.now()}.mp3`;

        const upload = new Upload({
            client: s3,
            params: {
                Bucket: "polly-audio-files3",
                Key: key,
                Body: data.AudioStream,
                ContentType: "audio/mpeg",
            },
        });
// i needto update my comments

/* 
multi line comment HELLLLLLP!!
*/
        await upload.done();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Audio file stored as ${key}` }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};


