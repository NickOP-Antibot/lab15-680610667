import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currentUser } from "@/lib/mock-data";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-start pt-2 p-6">
        <Card className="w-full max-w-lg p-6 flex flex-col items-start gap-4">
          <h2 className="text-xl font-semibold">
            ระบบลงทะเบียนเรียน CPE & ISNE
          </h2>

          <Button onClick={() => navigate("/enrollment")}>
            ไปหน้าลงทะเบียนเรียน
          </Button>
        </Card>
        <p className="text-sm text-muted-foreground mt-4">
          จัดทำโดย {currentUser.name} รหัสนักศึกษา {currentUser.studentId}
        </p>
      </div>

      <footer className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
        จัดทำโดย {currentUser.name} รหัสนักศึกษา {currentUser.studentId}
      </footer>
    </div>
  );
}
