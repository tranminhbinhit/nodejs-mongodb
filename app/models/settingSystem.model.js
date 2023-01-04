module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      settingTypeId: Number,
      settingCode: String,
      settingName: String,
      settingValue: String,
      settingType: String,
      sort: Number,

      isEdit: Boolean,
      isShow: Boolean,
      isActive: Boolean,
      isDelete: Boolean
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
  const SettingSystem = mongoose.model("SettingSystem", schema);
  return SettingSystem;
};
