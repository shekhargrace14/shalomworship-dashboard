db.song.updateMany(
  {},
  {
    $unset: {
      channelId: ""
    }
  }
)