The Endpoints for the various routes used in the project are listed below :

Authorization Endpoints
| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| `GET`  | `/classes`          | Get list of all classes         |
| `POST` | `/register/student` | Register a new student          |
| `POST` | `/register/faculty` | Register a new faculty          |
| `POST` | `/register/admin`   | Register a new admin            |
| `POST` | `/login`            | Login for student/faculty/admin |


Student Endpoints
| Method | Endpoint                          | Description                                |
| ------ | --------------------------------- | ------------------------------------------ |
| `GET`  | `/student/:id/attendance`         | Get student's attendance details & %       |
| `POST` | `/student/:id/condonation`        | Submit a condonation request               |
| `GET`  | `/student/:id/events`             | View events the student has registered for |
| `POST` | `/student/:id/event/:eventId`     | Register for an event (creates attendance) |
| `GET`  | `/student/:id/condonation/status` | View status of condonation requests        |


Faculty Endpoints
| Method | Endpoint                                  | Description                           |
| ------ | ----------------------------------------- | ------------------------------------- |
| `GET`  | `/faculty/:id/students`                   | Get all students in faculty’s classes |
| `POST` | `/faculty/attendance`                     | Mark attendance for a student         |
| `PUT`  | `/faculty/condonation/:requestId/approve` | Approve a condonation request         |

Admin Endpoints
| Method | Endpoint                         | Description                             |
| ------ | -------------------------------- | --------------------------------------- |
| `POST` | `/admin/event`                   | Create a new event                      |
| `GET`  | `/admin/event/:eventId/students` | View students registered for an event   |
| `PUT`  | `/admin/event/validate`          | Mark attendance as present for an event |
