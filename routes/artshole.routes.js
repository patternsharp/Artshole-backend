const authController = require("../controllers/auth/auth.controller");
const userManageController = require("../controllers/manage/user.mcontroller");
const categoryManageController = require("../controllers/manage/category.mcontroller");
const artworkManageController = require("../controllers/manage/artwork.mcontroller");
const artPropertyMController = require('../controllers/manage/property.mcontroller');
const collectionManageController = require("../controllers/manage/collection.mcontroller");
const commentManageController = require("../controllers/manage/comment.mcontroller");
const analysisManageController = require("../controllers/manage/analysis.mcontroller");

const userController = require("../controllers/user.controller");
const artworkController = require("../controllers/artwork.controller");
const collectionController = require("../controllers/collection.controller")
const videoController = require("../controllers/video.controller")
const commentController = require("../controllers/comment.controller")
const messageController = require("../controllers/message.controller")
const chatController = require("../controllers/chat.controller")
const notificationController = require("../controllers/notification.controller")

const upload = require("../utils/multerConfig")
const multiUpload = require('../utils/multiUpload')

module.exports = function (app) {
  // authentication api
  app.get("/api/account/my-account", authController.Welcome);
  app.post("/api/signup", authController.SignUp);
  // app.post("/api/signup", (req, res) => {res.send({message : 'this is test'})});
  app.post("/api/signupWithGoogle", authController.SignUpWithGoogle);
  app.post("/api/signin", authController.SignIn);
  app.post("/api/signinWithGoogle", authController.SignInWithGoogle);
  app.post("/api/update-profile", upload(), authController.UpdateProfile);
  app.post("/api/update-social", authController.UpdateSocial);
  app.post("/api/update-password", authController.UpdatePassword);
  app.get("/api/signup/email-verify/:token", authController.UserVerification);
  app.post("/api/signup/resend-verify-link", authController.ResendVerification);
  app.post("/api/password/forgot", authController.ForgotPassword);
  app.put("/api/password/reset/:token", authController.ResetPassword);
  app.post("/api/delete-account", authController.DeleteAccount);


  //=========Client Panel==============
  //user api
  app.get("/api/user/manage-artists", userController.GetAllArtists);
  app.post("/api/user/artists", userController.GetInitialArtists);
  app.post("/api/user/social/follow", userController.ToggleFollow);
  app.get("/api/user/search", userController.SearchUsers);
  app.post("/api/user/get-oneuser", userController.GetUserDetailsByScreenName)
  app.post("/api/user/report", userController.ReportUser)

  //artwork api
  app.post("/api/artwork/add-artwork", multiUpload(), artworkController.AddArtwork);
  app.post("/api/artwork/update-artwork", multiUpload(), artworkController.UpdateArtwork);
  app.post("/api/artwork/delete-artwork", artworkController.DeleteArtwork);
  app.get("/api/artwork/get-artworks", artworkController.GetClientArtworks);
  app.post("/api/artwork/initial", artworkController.GetInitialArtworksByUser);
  app.post("/api/artwork/view", artworkController.ViewCountArtwork);
  app.post("/api/artwork/like", artworkController.ToggleLike);

  //collection api
  app.post("/api/collection/add-collection", upload(), collectionController.AddCollection);
  app.post("/api/collection/update-collection", collectionController.UpdateCollection);
  app.post("/api/collection/delete-collection", collectionController.DeleteCollection);
  app.get("/api/collection/get-collections", collectionController.GetClientCollections);
  app.post("/api/collection/initial", collectionController.GetInitialCollectionsByUser);
  app.get("/api/collection/search", collectionController.SearchCollections);
  app.post("/api/collection/view", collectionController.ViewCountCollection);
  app.post("/api/collection/get-onecollection", collectionController.GetCollectionDetailsById)
  app.post("/api/collection/my-collections", collectionController.GetMyCollections)
  app.post("/api/collection/update-artwork", collectionController.UpdateArtworkOnCollection)

  //video api
  app.post("/api/video/add-video", videoController.AddVideo);
  app.post("/api/video/update-video", videoController.UpdateVideo);
  app.post("/api/video/delete-video", videoController.DeleteVideo);
  app.get("/api/video/get-videos", videoController.GetClientVideos);

  //comment api
  app.post("/api/comment/add-comment", commentController.AddComment);

  // message api
  app.post("/api/message/new-message", messageController.NewMessage);
  app.get("/api/message/get-messages/:chatId", messageController.GetMessages);

  // chat api
  app.post("/api/chat/new-chat", chatController.NewChat);
  app.get("/api/chat/get-chats/:userId", chatController.GetChats);


  //notification management api
  app.post("/api/notification/add-notification", notificationController.AddNotification);
  app.post("/api/notification/get-notifications", notificationController.GetNotifications);
  app.post("/api/notification/read-notifications", notificationController.ReadNotifications);
  app.post("/api/notification/delete-notifications", notificationController.DeleteNotifications);


  //=========Admin Panel==============
  //user management api
  app.get("/api/manage/user/manage-users", userManageController.GetAllUsers);
  app.post("/api/manage/user/delete-user", userManageController.DeleteUser);

  //artist category management api
  app.post("/api/manage/category/add-artist-category", categoryManageController.AddArtistCategory);
  app.get("/api/manage/category/get-artist-category", categoryManageController.GetArtistCategory);
  app.post("/api/manage/category/update-artist-category", categoryManageController.UpdateArtistCategory);
  app.post("/api/manage/category/delete-artist-category", categoryManageController.DeleteArtistCategory);

  //job category management api
  app.post("/api/manage/category/add-job-category", categoryManageController.AddJobCategory);
  app.get("/api/manage/category/get-job-category", categoryManageController.GetJobCategory);
  app.post("/api/manage/category/update-job-category", categoryManageController.UpdateJobCategory);
  app.post("/api/manage/category/delete-job-category", categoryManageController.DeleteJobCategory);

  //artwork category management api
  app.post("/api/manage/category/add-artwork-category", categoryManageController.AddArtworkCategory);
  app.get("/api/manage/category/get-artwork-category", categoryManageController.GetArtworkCategory);
  app.post("/api/manage/category/update-artwork-category", categoryManageController.UpdateArtworkCategory);
  app.post("/api/manage/category/delete-artwork-category", categoryManageController.DeleteArtworkCategory);

  //collection category management api
  app.post("/api/manage/category/add-collection-category", categoryManageController.AddCollectionCategory);
  app.get("/api/manage/category/get-collection-category", categoryManageController.GetCollectionCategory);
  app.post("/api/manage/category/update-collection-category", categoryManageController.UpdateCollectionCategory);
  app.post("/api/manage/category/delete-collection-category", categoryManageController.DeleteCollectionCategory);

  //artwork management api
  app.get("/api/manage/artwork/get-artwork", artworkManageController.GetAllArtworks);

  //artwork property management api
  app.post("/api/manage/property/add-artwork-property", artPropertyMController.AddArtworkProperty);
  app.get("/api/manage/property/get-artwork-property", artPropertyMController.GetArtworkProperty);
  app.post("/api/manage/property/update-artwork-property", artPropertyMController.UpdateArtworkProperty);
  app.post("/api/manage/property/delete-artwork-property", artPropertyMController.DeleteArtworkProperty);

  //collection management api
  app.get("/api/manage/collection/get-collection", collectionManageController.GetAllCollections);

  //comment management api
  app.post("/api/manage/comment/get-comment", commentManageController.GetComments);
  app.post("/api/manage/comment/add-comment", commentManageController.AddComment);

  //analysis api
  app.get('/api/day/all-visitors', analysisManageController.GetAllVisitors);
  app.get('/api/new-users', analysisManageController.GetNewUsers)
  // app.get()
};
