module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      email: String,
      userName: String,
      fullName: String,
      password: String,
      socialAuthen: Object,

      isActive: Boolean,
      isDelete: Boolean,

      socialLinkObj: Object,
      linkObj: Object,
      userInfo: Object
    },
    { 
      timestamps: true 
    }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  //Table name
  const User = mongoose.model("User", schema);
  return User;
};
