import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import axios from "axios";
import { AI_RESPONSE_ROUTE, TWITTER_POSTING_ROUTE } from "./constants/constants";

interface PlatformResponse {
  twitter: string;
  discord: string;
  reddit: string;
}

const PostWithAIResponses: React.FC = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [aiResponses, setAiResponses] = useState<PlatformResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, 4);
    setImages(selected);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(AI_RESPONSE_ROUTE, {
        prompt: content,
      });
      setAiResponses(response.data.data);
    } catch (err) {
      console.error("AI generation error:", err);
    }
    setLoading(false);
  };

  const handleTweetPost = async () => {
    setPosting(true);
    try {
      const formData = new FormData();
      const tweetContent = aiResponses?.twitter || content; // Use AI-generated Twitter content or fallback to user input
      if (!tweetContent.trim()) {
        alert("Tweet content is empty!");
        setPosting(false);
        return;
      }
      formData.append("tweetText", tweetContent);
      images.forEach((img) => formData.append("media", img));

      // Debug: Log FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      await axios.post(TWITTER_POSTING_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Optional, Axios sets this automatically
        },
      });
      alert("Tweet posted successfully!");
    } catch (err) {
      console.error("Tweet post error:", err);
      alert("Failed to post tweet.");
    }
    setPosting(false);
  };
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <Label htmlFor="daily-share">What did you do today?</Label>
          <Textarea
            id="daily-share"
            placeholder="Write about your day..."
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />

          <Label htmlFor="images">Upload up to 4 images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate AI Responses"}
          </Button>
        </CardContent>
      </Card>

      {aiResponses && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">Twitter</h3>
              <p>{aiResponses.twitter}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">Discord</h3>
              <p>{aiResponses.discord}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">Reddit</h3>
              <p>{aiResponses.reddit}</p>
            </CardContent>
          </Card>

          <Button onClick={handleTweetPost} disabled={posting}>
            {posting ? "Posting..." : "Post to Twitter"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostWithAIResponses;
