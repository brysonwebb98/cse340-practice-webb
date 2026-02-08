import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

// Route handler for the faculty list page
const facultyListPage = async (req, res) => {

    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';
    const faculty = await getSortedFaculty(sortBy);

    res.render("faculty/list", {
        title: 'Faculty Directory',
        faculty,
        currentSort: sortBy
    });
};

// Route handler for individual faculty detail pages
const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultyId;

    // TESTING
    console.log(facultySlug);
    console.log("TESTING");
    const faculty = await getFacultyBySlug(facultySlug)

    if (Object.keys(faculty).length === 0) {
        const err = new Error(`Faculty ${facultySlug} not found`);
        err.status = 404;
        return next(err)
    }

    res.render("faculty/detail", {
        title: 'Faculty Name',
        faculty: faculty
    });
};

export {facultyListPage, facultyDetailPage};