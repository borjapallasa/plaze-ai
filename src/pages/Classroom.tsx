
import { MainHeader } from "@/components/MainHeader";

export default function Classroom() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to the Classroom</h1>
            <p className="text-muted-foreground mt-2">
              Access your learning materials and courses
            </p>
          </div>
          
          {/* Course List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Course Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">Introduction to Web Development</h3>
                <p className="text-sm text-muted-foreground">
                  Learn the basics of web development including HTML, CSS, and JavaScript.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">12 Lessons</span>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
            
            {/* Add more course cards as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
