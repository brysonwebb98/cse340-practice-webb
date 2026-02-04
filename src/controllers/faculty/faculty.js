import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js"

// Route handler for the faculty list page
const facultyListPage = (req, res) => {

    // Handle sorting if requested
    const sortBy = req.query.sort || 'department';
    const faculty = getSortedFaculty(sortBy)

    res.render("faculty/list", {
        title: 'Faculty Directory',
        faculty,
        currentSort: sortBy
    });
};

// Route handler for individual faculty detail pages
const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const faculty = getFacultyById(facultyId)

    if (!faculty) {
        const err = new Error(`Faculty ${facultyId} not found`);
        err.status = 404;
        return next(err)
    }

    res.render("faculty/detail", {
        title: 'Faculty Name',
        faculty: faculty
    });
};

export {facultyListPage, facultyDetailPage};