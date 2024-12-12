// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15", // Note: future date is possibly a typo
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  // Function to calculate adjusted score considering late submission
  function calculateAdjustedScore(submissionDate, dueDate, score, pointsPossible) {
    const isLate = new Date(submissionDate) > new Date(dueDate);
    const latePenalty = isLate ? 15 : 0;  // 15-point penalty for late submission
    const adjustedScore = Math.max(score - latePenalty, 0);
    return (adjustedScore / pointsPossible).toFixed(2); // Return the score fraction
  }
  
  // Function to get or create learner data entry
  function getOrCreateLearnerResult(result, learner_id) {
    let learnerResult = result.find(r => r.id === learner_id);
    if (!learnerResult) {
      learnerResult = { id: learner_id, avg: 0, totalScore: 0, totalPoints: 0 };
      result.push(learnerResult);
    }
    return learnerResult;
  }
  
  // Function to calculate learner data
  function getLearnerData(course, assignmentGroup, submissions) {
    const result = [];
  
    try {
      // Iterate through all submissions
      for (let submission of submissions) {
        const { learner_id, assignment_id, submission: submissionData } = submission;
        const assignment = assignmentGroup.assignments.find(a => a.id === assignment_id);
  
        if (assignment) {
          let learnerResult = getOrCreateLearnerResult(result, learner_id);
  
          // Calculate the adjusted score
          const scoreFraction = calculateAdjustedScore(submissionData.submitted_at, assignment.due_at, submissionData.score, assignment.points_possible);
  
          // Update learner data with the score fraction
          learnerResult[assignment_id] = scoreFraction;
          learnerResult.totalScore += parseFloat(scoreFraction) * assignment.points_possible;
          learnerResult.totalPoints += assignment.points_possible;
        }
      }
  
      // Calculate average score for each learner
      for (let learner of result) {
        learner.avg = (learner.totalScore / learner.totalPoints).toFixed(3);
        delete learner.totalScore;
        delete learner.totalPoints;
      }
  
    } catch (error) {
      console.error("Error processing learner data:", error.message);
    }
  
    return result;
  }
  
  // Call the function and log the results
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  console.log(result);
  
  /* Expected Output:
  [
    {
      id: 125,
      avg: 0.985,
      1: 0.94,
      2: 1.00
    },
    {
      id: 132,
      avg: 0.820,
      1: 0.78,
      2: 0.833
    }
  ]
  */
  