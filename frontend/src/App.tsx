import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import axios from "axios";
import {
  AI_RESPONSE_ROUTE,
  TWITTER_POSTING_ROUTE,
  REDDIT_POSTING_ROUTE
} from "./constants/constants";
import { Separator } from "./components/ui/separator";
import { Loader2 } from "lucide-react";

interface PlatformResponse {
  twitter: string;
  discord: string;
  reddit: {
    title: string;
    content: string;
  };
}

const PostWithAIResponses: React.FC = () => {
  const [content, setContent] = useState("");
  const [tweetContent, setTweetContent] = useState<string | undefined>(undefined);
  const [redditContent, setRedditContent] = useState<{ title: string, content: string } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [aiResponses, setAiResponses] = useState<PlatformResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [postingTwitter, setPostingTwitter] = useState(false);
  const [postingReddit, setPostingReddit] = useState(false);
  const [subreddit, setSubreddit] = useState('reactjs');

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
      setTweetContent(response.data.data.twitter);
      setRedditContent(response.data.data.reddit);
    } catch (err) {
      console.error("AI generation error:", err);
      alert("Failed to generate AI responses.");
    }
    setLoading(false);
  };

  const handleTweetPost = async () => {
    setPostingTwitter(true);
    try {
      const tweetText = tweetContent || content;
      if (!tweetText || !tweetText.trim()) {
        alert("Tweet content is empty!");
        setPostingTwitter(false);
        return;
      }

      const formData = new FormData();
      formData.append("tweetContent", tweetText);
      images.forEach((img) => formData.append("files", img));

      const response = await axios.post(TWITTER_POSTING_ROUTE, formData);
      alert("Tweet posted successfully!");
      console.log("Tweet response:", response.data);
    } catch (err: any) {
      console.error("Tweet post error:", err);
      const errorMessage = err.response?.data?.message || "Failed to post tweet.";
      alert(errorMessage);
    }
    setPostingTwitter(false);
  };

  const handleRedditPost = async () => {
    if (!redditContent) {
      alert('No Reddit content available!');
      return;
    }

    setPostingReddit(true);
    try {
      const formData = new FormData();
      formData.append('title', redditContent.title);
      formData.append('content', redditContent.content);
      formData.append('subreddit', 'reactjs'); // Add subreddit
      if (images.length > 0) {
        formData.append('image', images[0]);
      }

      const response = await axios.post(REDDIT_POSTING_ROUTE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Reddit post submitted successfully!');
      console.log('Reddit response:', response.data);
    } catch (err: any) {
      console.error('Reddit post error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to post to Reddit.';
      alert(errorMessage);
    }
    setPostingReddit(false);
  };

  const resetForm = () => {
    setContent("");
    setImages([]);
    setAiResponses(null);
    setTweetContent(undefined);
    setRedditContent(null);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Social Media Post Generator</h1>

      <Card className="shadow-lg">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="daily-share" className="text-lg">What did you do today?</Label>
            <Textarea
              id="daily-share"
              placeholder="Write about your day..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="text-lg">Upload images (up to 4)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={resetForm}
              variant="outline"
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : "Generate AI Responses"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {aiResponses && (
        <div className="space-y-6">
          <Separator className="my-4" />

          <h2 className="text-xl font-semibold">Generated Responses</h2>

          {/* Twitter Card */}
          <Card className="border-blue-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Twitter</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{aiResponses.twitter}</p>
              <div className="flex justify-end">
                <Button
                  onClick={handleTweetPost}
                  disabled={postingTwitter}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {postingTwitter ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : "Post to Twitter"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reddit Card */}
          <Card className="border-orange-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.5.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.963-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Reddit</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-gray-800">Title:</h4>
                  <p className="text-gray-700">{aiResponses.reddit.title}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Content:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{aiResponses.reddit.content}</p>
                </div>
              </div>
                      <div className="space-y-2">
            <Label htmlFor="subreddit">Subreddit (FOR REDDIT ONLY)</Label>
            <Input
              id="subreddit"
              placeholder="e.g., reactjs"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
            />
          </div>

              <div className="flex justify-end gap-2">
                {images.length > 0 && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-1">Image will be included</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{images[0].name}</span>
                  </div>
                )}
                <Button
                  onClick={handleRedditPost}
                  disabled={postingReddit}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {postingReddit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : "Post to Reddit"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discord Card (placeholder) */}
          <Card className="border-indigo-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Discord</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{aiResponses.discord}</p>
              <div className="flex justify-end">
                <Button variant="outline" disabled className="text-indigo-500 border-indigo-300">
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PostWithAIResponses;