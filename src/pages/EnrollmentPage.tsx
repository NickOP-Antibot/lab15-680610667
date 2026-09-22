import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  courses,
  enrollments,
  CURRENT_STUDENT_ID,
  currentUser,
} from "@/lib/mock-data";
import { Trash2, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EnrollmentPage() {
  const [enrollmentList, setEnrollmentList] = useState(enrollments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollTime, setEnrollTime] = useState("");

  useEffect(() => {
    if (isDialogOpen) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setEnrollTime(`${hours}:${minutes}`);

      setSelectedCourse("");
    }
  }, [isDialogOpen]);

  const displayCourses = courses.map((course) => {
    const enrollment = enrollmentList.find(
      (e) =>
        e.courseId === course.courseId && e.studentId === CURRENT_STUDENT_ID,
    );
    return {
      ...course,
      isEnrolled: !!enrollment,
      enrolledAt: enrollment?.enrolledAt || null,
    };
  });

  const availableCourses = displayCourses.filter((c) => !c.isEnrolled);

  const handleEnrollSubmit = () => {
    if (!selectedCourse) return;

    const today = new Date().toISOString().split("T")[0];
    const newEnrollment = {
      studentId: CURRENT_STUDENT_ID,
      courseId: selectedCourse,
      enrolledAt: `${today}T${enrollTime}:00`,
    };

    setEnrollmentList([...enrollmentList, newEnrollment]);
    setIsDialogOpen(false);
    setSelectedCourse("");
  };

  const handleCancelEnrollment = (courseId: string) => {
    setEnrollmentList((prev) => prev.filter((e) => e.courseId !== courseId));
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">รายวิชาทั้งหมด</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentUser.name} ({currentUser.studentId})
          </p>
        </div>

        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          ลงทะเบียน
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ลงทะเบียนเรียน</DialogTitle>
            <DialogDescription className="p">
              เลือกวิชาที่ต้องการลงทะเบียน แล้วกรอกข้อมูลให้ครบ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 pt-0">
            <div className="space-y-2">
              <Label>วิชา</Label>
              <Select
                value={selectedCourse || undefined}
                onValueChange={(value) => setSelectedCourse(value || "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกวิชา">
                    {selectedCourse
                      ? (() => {
                          const found = courses.find(
                            (c) => c.courseId === selectedCourse,
                          );
                          return found ? (
                            <span className="block max-w-[290px] text-left">
                              {found.courseId} - {found.courseTitle}
                            </span>
                          ) : (
                            selectedCourse
                          );
                        })()
                      : undefined}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  className="w-[var(--anchor-width)] overflow-hidden"
                  style={{ width: "var(--anchor-width)" }}
                >
                  {availableCourses.length > 0 ? (
                    availableCourses.map((course) => (
                      <SelectItem key={course.courseId} value={course.courseId}>
                        <span className="whitespace-normal break-words text-left">
                          {course.courseId} - {course.courseTitle}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled></SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>เวลาเรียน</Label>
              <Input
                type="time"
                value={enrollTime}
                onChange={(e) => setEnrollTime(e.target.value)}
                className="[color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label>ชื่อ นศ.</Label>
              <Input readOnly value={currentUser.name} className="muted" />
            </div>

            {/* โปรแกรม */}
            <div className="space-y-2">
              <Label>โปรแกรม</Label>
              <Input readOnly value={currentUser.program} className="muted" />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleEnrollSubmit}
              disabled={!selectedCourse || selectedCourse === "none"}
            >
              ยืนยันการลงทะเบียน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex flex-col gap-4">
        {displayCourses.map((course) => (
          <Card key={course.courseId} className="relative overflow-hidden">
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {course.courseTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    รหัสวิชา: {course.courseId} • ผู้สอน:{" "}
                    {course.instructors.join(", ")}
                  </p>

                  {course.isEnrolled && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>ชื่อ นศ.: {currentUser.name}</p>
                      <p>โปรแกรม: {currentUser.program}</p>
                      <p>
                        ลงทะเบียนเมื่อ:{" "}
                        {course.enrolledAt
                          ? (() => {
                              const dateObj = new Date(course.enrolledAt);
                              const dateStr = dateObj.toLocaleDateString(
                                "th-TH",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              );
                              const timeStr = dateObj.toLocaleTimeString(
                                "th-TH",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                },
                              );
                              return `${dateStr} ${timeStr}`;
                            })()
                          : "-"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className={
                      course.isEnrolled
                        ? "bg-amber-100 text-amber-700 dark:bg-purple-900 dark:text-purple-300 border-none"
                        : "bg-purple-100 text-purple-700 dark:bg-amber-900 dark:text-amber-300 border-none"
                    }
                  >
                    {course.isEnrolled ? "ลงทะเบียนแล้ว" : "เปิดรับ"}
                  </Badge>

                  {course.isEnrolled && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 mt-16"
                      onClick={() => handleCancelEnrollment(course.courseId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
        จัดทำโดย {currentUser.name} รหัสนักศึกษา {currentUser.studentId}
      </footer>
    </div>
  );
}
