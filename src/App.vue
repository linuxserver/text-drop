<template>
  <div id="app">
    <notifications position="top center"/>
    <div v-if="ro === true" class="topbutton" @click="copyToClipboard(content)"><font-awesome-icon icon="clone" /></div>
    <div v-if="ro !== true" class="topbutton" @click="upload()"><font-awesome-icon icon="cloud-upload-alt" /></div>
    <editor v-model="content" @init="editorInit" lang="text" theme="gob" :height="windowHeight" :width="windowWidth" class="editor"></editor>
    <font-awesome-icon class="bottomicon" :icon="['fab', 'github']" @click="githublink" />
    <div class="uploading" v-show="showspinner === true">
      <div class="dot-fire"></div>
    </div>
  </div>
</template>

<script>
import ipfsHttpClient from 'ipfs-http-client'
export default {
  name: 'App',
  data() {
    return {
      ipfs: null,
      content: null,
      windowHeight: window.innerHeight - 20,
      windowWidth: window.innerWidth - 20,
      showspinner: false,
      ro: false
    }
  },
  components: {
    editor: require('vue2-ace-editor')
  },
  mounted: async function () {
    this.$nextTick(async () => {
      window.addEventListener('resize', this.onResize)
      if (window.location.hash) {
        this.ro = true
        this.showspinner = true
        let cid = window.location.hash.replace('#/','')
        let ipfsres = await fetch('https://ipfs.infura.io/ipfs/' + cid)
        if (ipfsres.ok) {
          let content = await ipfsres.text()
          this.content = content
          this.showspinner = false
        }
      } else {
        this.ipfs = await ipfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
      }
    })
  },
  methods: {
    async upload () {
      if (this.content) {
        const that = this
        that.showspinner = true
        const filebytes = Buffer.from(this.content, 'utf-8');
        let ipfsreturn = await that.ipfs.add(filebytes)
        let cid = ipfsreturn.path
        that.showspinner = false
        window.open('/#/' + cid)
      }
    },
    editorInit (editor) {
      require('brace/mode/text')
      require('brace/theme/gob')
      if (window.location.hash) {
        editor.setReadOnly(true)
      }
    },
    onResize() {
      this.windowHeight = window.innerHeight - 20
      this.windowWidth = window.innerWidth - 20
    },
    githublink () {
      window.open('https://github.com/linuxserver/text-drop')
    },
    copyToClipboard(text) {
      let input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.$notify({
        title: 'Success!',
        text: 'Copied to clipboard',
        type: 'success'
      })
    }
  }
}
</script>

<style>
html body {
  background: black;
}
.editor {
  font-size: 14px;
}
.topbutton {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
  margin: 0 auto;
  color: #ccc;
  font-size: 40px;
  z-index: 20;
  color: rgba(3, 238, 3, 0.4);
}
.topbutton:hover {
  font-size: 55px;
  transition-duration: .2s;
  color: rgba(3, 238, 3, 1);
}
.bottomicon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  bottom: 20px;
  margin: 0 auto;
  color: #ccc;
  font-size: 40px;
  z-index: 20;
  color: rgba(3, 238, 3, 0.4);
}
.bottomicon:hover {
  font-size: 55px;
  transition-duration: .2s;
  color: rgba(3, 238, 3, 1);
}
.uploading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #221423c4;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
}
.dot-fire {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #03EE03;
  color: #03EE03;
  box-shadow: 9999px 22.5px 0 -5px #03EE03;
  animation: dot-fire 1.5s infinite linear;
  animation-delay: -.85s;
}
.dot-fire::before, .dot-fire::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #03EE03;
  color: #03EE03;
}
.dot-fire::before {
  box-shadow: 9999px 22.5px 0 -5px #03EE03;
  animation: dot-fire 1.5s infinite linear;
  animation-delay: -1.85s;
}
.dot-fire::after {
  box-shadow: 9999px 22.5px 0 -5px #03EE03;
  animation: dot-fire 1.5s infinite linear;
  animation-delay: -2.85s;
}
@keyframes dot-fire {
  1% { box-shadow: 9999px 22.5px 0 -5px #03EE03; }
  50% { box-shadow: 9999px -5.625px 0 2px #03EE03; }
  100% { box-shadow: 9999px -22.5px 0 -5px #03EE03; }
}
.vue-notification-group {
  padding-top: 50px;
}
body .ace_scrollbar {
  background: black;
  -webkit-transition: opacity .3s ease-in-out;
     -moz-transition: opacity .3s ease-in-out;
      -ms-transition: opacity .3s ease-in-out;
       -o-transition: opacity .3s ease-in-out;
          transition: opacity .3s ease-in-out;
  opacity: 0;
}
body .ace_editor:hover .ace_scrollbar {
  opacity: 1;
}
</style>
