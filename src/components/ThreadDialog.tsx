
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Heart, ThumbsUp } from "lucide-react";

interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export function ThreadDialog({ isOpen, onClose }: ThreadDialogProps) {
  const comments: Comment[] = [
    {
      id: 1,
      author: {
        name: "Jamel MCMILLIAN",
        avatar: "https://github.com/shadcn.png"
      },
      content: "Hello everyone! Looking forward to learning from this community.",
      timestamp: "26 Jun 2024, 08:14"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>BP</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Letter from Borja</h2>
              <div className="text-sm text-muted-foreground">
                Created by Borja P.
              </div>
              <Badge variant="secondary" className="text-xs mt-1">Total Messages: 1</Badge>
              
              <div className="space-y-3 mt-4">
                <p>👋 Welcome to Optimal Path Automations! 👋</p>
                <p className="text-sm">
                  Hey everyone! I'm Borja, and I'm thrilled to welcome you to our community. Creating this space is a dream come true for me because I am passionate about helping others discover the power of no-code automation.
                </p>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Learning Together:</h3>
                  <p className="text-sm">We'll dive into tutorials, share tips, and explore new ways to automate your business processes without any coding.</p>
                  
                  <h3 className="font-semibold text-sm">Supporting Each Other:</h3>
                  <p className="text-sm">This is a space for collaboration and support. Share your projects, ask questions, and give feedback.</p>
                  
                  <h3 className="font-semibold text-sm">Resources:</h3>
                  <p className="text-sm">Access a variety of resources, both free and premium, including guides, videos, and templates to help you on your automation journey.</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-sm">To make our community a great place for everyone, here are a few simple rules:</p>
                  <ul className="space-y-1 text-sm">
                    <li>🤝 Be Respectful: Treat everyone with kindness and respect.</li>
                    <li>💻 Stay on Topic: Keep discussions focused on no-code automations.</li>
                    <li>🛠 Share and Help: Offer helpful feedback and share your knowledge.</li>
                    <li>❓ Ask Anything: No question is too small or silly. We're all learning!</li>
                    <li>✨ Enjoy the Journey: Have fun and enjoy the process of learning and automating.</li>
                  </ul>
                </div>

                <p className="text-sm">Feel free to introduce yourself, share your goals, and let us know how we can help you. I'm here to teach and support you every step of the way.</p>
                <p className="text-sm">Again, thanks for being part of Optimal Path Automations.</p>
                <p className="text-sm">Borja.</p>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>1</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>4</span>
                  </button>
                </div>
                <span>10/24/2024, 8:31 PM</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-sm">Comments</h3>
            {comments.map((comment) => (
              <Card key={comment.id} className="p-3">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>JM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="border-t p-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <textarea
                placeholder="Write a comment..."
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex justify-end">
                <Button size="sm">Comment</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
