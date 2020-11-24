<template>
<!-- eslint-disable max-len -->
  <div>
    <button @click="showMessageForm = !showMessageForm" type="button" class="btn btn-secondary mt-3 mb-3">Toggle message form</button>

    <form v-if="showMessageForm" @submit.prevent="addMessage" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <h4 class="alert-heading">ERRoR!</h4>
        <p class="mb-0">{{error}}</p>
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="msg.username" type="text" class="form-control" id="username" value="Anonymous" required>
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <input v-model="msg.subject" type="text" class="form-control" id="subject" placeholder="Enter a subject" required>
      </div>
      <div class="form-group">
        <label for="msg">Message</label>
        <textarea v-model="msg.msg" class="form-control" id="msg" ></textarea>
      </div>
      <div class="form-group">
        <label for="imgURL">Subject</label>
        <input v-model="msg.imgURL" type="text" class="form-control" id="imgURL" placeholder="Img!" required>
      </div>
      <button type="submit" class="btn btn-info">Add message</button>
    </form>
    <div class="list-unstyled" v-for="message in reversedMsgs" :key="message._id">
      <li class="media">
        <img v-if="message.imgURL" class="mr-3" :src="message.imgURL" :alt="message.subject">
        <div class="media-body">
          <h5 class="mt-0 mb-1">{{message.subject}}</h5>
          {{message.msg}}
          <br>
          <small>{{message.created}}</small>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:1234/messages';

export default {
  name: 'Home',
  data: (() => ({
    showMessageForm: false,
    error: '',
    messages: [],
    msg: {
      username: 'Anonymous',
      subject: '',
      msg: '',
      imgURL: '',
    },
  })),
  computed: {
    reversedMsgs() {
      return this.messages.slice().reverse();
    },
  },
  mounted() {
    fetch(API_URL).then((response) => response.json()).then((result) => {
      this.messages = result;
    });
  },
  methods: {
    addMessage() {
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.msg),
        headers: {
          'content-type': 'application/json',
        },
      }).then((response) => response.json()).then((result) => {
        if (result.details) {
          const error = result.details.map((detail) => detail.message).join(' ');
          this.error = error;
        } else {
          this.showMessageForm = false;
          this.error = '';
          this.messages.push(result);
        }
      });
    },
  },
};
</script>

<style>
hr{
  border-top: 1px solid white;
}

img{
  max-width: 300px;
  max-height: auto
  ;
}
</style>
