const { updateEntry, addComment } = require("./api/entries/entry.controller");

var io = require("socket.io")();
io.on("connection", function (socket) {
  console.log("user is connected", socket.id);

  socket.on("joinRoom", ({ userId, cardId }, callback) => {
    socket.join(cardId);
  });

  socket.on(
    "likeVideo",
    async ({ cardId, userId, entryId, cardMemberId }, callback) => {
      const likeResult = await updateEntry(
        cardId,
        userId,
        entryId,
        cardMemberId
      );
      if (likeResult) {
        io.to(cardId).emit("likeResult", likeResult);
      }
    }
  );

  socket.on(
    "addComment",
    async ({ cardId, userId, entryId, cardMemberId, comments }, callback) => {
      const Comments = await addComment(
        cardId,
        userId,
        entryId,
        cardMemberId,
        comments
      );
      if(Comments) {
        io.to(cardId).emit("comment", Comments);
      }
    }
  );
  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

io.on("error", function () {
  console.log("errr");
});

module.exports = { io };
