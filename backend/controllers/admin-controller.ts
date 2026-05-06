import dbConnect from "../config/dbconnect";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Interview from "../models/interview-model";
import User from "../models/user-model";

export const getAdminStats = catchAsyncErrors(async () => {
  await dbConnect();

  const [
    totalUsers,
    activeSubscriptions,
    totalInterviews,
    completedInterviews,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ "subscription.status": "active" }),
    Interview.countDocuments({}),
    Interview.countDocuments({ status: "completed" }),
  ]);

  // Each subscription is $9.99/month
  const subscriptionWorth = Number((activeSubscriptions * 9.99).toFixed(2));

  const interviewCompletionRate =
    totalInterviews > 0
      ? Number(((completedInterviews / totalInterviews) * 100).toFixed(2))
      : 0;

  const averageInterviewsPerUser =
    totalUsers > 0
      ? Number((totalInterviews / totalUsers).toFixed(2))
      : 0;

  return {
    totalUsers,
    activeSubscriptions,
    subscriptionWorth,
    totalInterviews,
    interviewCompletionRate,
    averageInterviewsPerUser,
  };
});
