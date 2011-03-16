Socky.PresenceChannel = Socky.PrivateChannel.extend({

  init: function(channel_name, socky, permissions, data) {
    this._super(channel_name, socky, permissions);
    this._members = {};
    this._subscription_data = data;
    this.bind('socky_internal:member_added', Socky.Utils.bind(this.on_member_added, this));
    this.bind('socky_internal:member_removed', Socky.Utils.bind(this.on_member_added, this));
  },

  disconnect: function(){
    this._members = {};
  },

  is_presence: function() {
    return true;
  },

  acknowledge_subscription: function(data) {
    this._super(data);
    this._members = data.members;
  },

  on_member_added: function(data) {
    this._members[data.connection_id] = data.data;
    this.trigger('socky:member:added', data.data);
  },

  on_member_removed: function(data) {
    var member = this._members[data.connection_id];
    delete this._members[data.connection_id];
    this.trigger('socky:member:removed', member);
  },

  generate_subscription_payload: function() {
    var payload = this._super();
    if (this._permissions.hide === true) {
      payload.hide = true;
    }
    payload.data = this._subscription_data;
    return payload;
  },

  members: function() {
    return this._members;
  }

});

