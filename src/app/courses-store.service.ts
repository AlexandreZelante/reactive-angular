import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "./model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";

// Singleton for the application
@Injectable({
  providedIn: "root",
})
export class CoursesStoreService {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>(" /api/courses").pipe(
      map((response) => response["payload"]),
      catchError((error) => {
        const message = "Could not load courses";
        this.messages.showErrors(message);
        console.log(message, error);
        return throwError(error);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();

    this.courses$.subscribe((value) => {
      console.log(" valuese", value);
    });
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // Modify in memory data
    const courses = this.subject.getValue();

    const index = courses.findIndex((course) => course.id == courseId);

    const newCourse = {
      ...courses[index],
      ...changes,
    };

    // Copy to a completely new array
    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    // Call server
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        console.log(message, err);
        this.messages.showErrors(message);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
