import Vue from 'vue/dist/vue.esm'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

window.axios = require('axios');

document.addEventListener('DOMContentLoaded', () => {
  const tagsVue = new Vue ({
    el: '#tags',
    methods:{
      openTagForm: function(){
        this.showNewTagForm = true
      },
      openStatusForm: function(id){
        this.showStatusFrom = true,
        this.changeStatusTag = id
      },
      openDeleteConf: function(id) {
        this.deleteConf = true,
        this.deleteTarget = id
      },
      closeModal: function(){
        this.showNewTagForm = false,
        this.showStatusFrom = false,
        this.deleteConf = false
      },
      addTag: function(){
        this.submitting = true;
        const newTag = {
          tag: {
            title: this.newTagTitle,
            status: 1
          }
        }
        axios.post('/api/tags', newTag)
          .then((res) => {
            console.log('just created a tag')
            const newTagRes = res.data.tag;
            const newTagPush = {
              id: 0,
              title: '',
              status: 0,
              errors: {
                text: '',
                // deadline: '',
                priority: ''
              },
              tasks: []
            }
            newTagPush.id = newTagRes.id;
            newTagPush.title = newTagRes.title;
            newTagPush.status = newTagRes.status;
            var newTaskTextItem = {text: ''};
            var newTaskDeadlineItem = {deadline: ''};
            var newTaskPriorityItem = {selected: 0};
            this.newTaskTextItems.push(newTaskTextItem);
            this.newTaskDeadlineItems.push(newTaskDeadlineItem);
            this.newTaskPriorityItems.push(newTaskPriorityItem);
            this.tags.push(newTagPush);
            this.submitting = false;
            this.showNewTagForm = false;
            this.newTagTitle = '';
            if (this.errors != '') {
              this.errors = ''
            }
          }).catch(error => {
            console.log('after addTag error')
            if (error.response.data && error.response.data.errors) {
              this.errors = error.response.data.errors;
            }
            this.submitting = false;
            this.showNewTagForm = false;
          });
      },
      addTask: function(tagId, i) {
        const newTask = {
          task: {
            text: this.newTaskTextItems[i].text,
            deadline: this.newTaskDeadlineItems[i].deadline,
            priority: this.newTaskPriorityItems[i].selected
          },
          tag_task_connection: {
            tag_id: tagId
          }
        }
        if (newTask.task.priority != 0) {
          this.tags[i].errors.priority = '';
          axios.post('/api/task/create', newTask)
          .then((res) => {
            console.log('just created a task')
            const newTaskRes = res.data.task
            const newTaskPush = {
              id: 0,
              deadline: '',
              priority: 0,
              text: '',
              limit: 0
            }
            newTaskPush.id = newTaskRes.id;
            newTaskPush.deadline = newTaskRes.deadline;
            newTaskPush.priority = newTaskRes.priority;
            newTaskPush.text = newTaskRes.text;
            newTaskPush.limit = newTaskPush.deadline != null ? Math.ceil((parseDate(newTaskPush.deadline).getTime() - new Date().getTime())/(1000*60*60*24)) : null;
            if (newTaskPush.limit != null) {
              if (newTaskPush.limit < 0) {
                this.tags[i].emergency = 3
              } else if(newTaskPush.limit == 0) {
                this.tags[i].emergency = 2
              } else if (newTaskPush.limit <= 3) {
                this.tags[i].emergency = 1
              }
            } else {
              this.tags[i].emergency = 0;
            }
            this.tags[i].tasks.push(newTaskPush),
            this.newTaskTextItems[i].text = '',
            this.newTaskDeadlineItems[i].deadline = '',
            this.newTaskPriorityItems[i].selected = '',
            this.tags[i].errors.text = '',
            // this.tags[i].errors.deadline = '',
            this.tags[i].errors.priority = ''
          })
          .catch(error => {
            console.log('after addTask error')
            if (error.response.data && error.response.data.errors) {
              this.tags[i].errors.text = error.response.data.errors.text ? 'タスクを入力してください。' : ''
              // this.tags[i].errors.deadline = error.response.data.errors.deadline ? '締め切りを設定してください。' : ''
            }
          });
        } else {
          var error = "優先度を選択してください。"
          this.tags[i].errors.priority = error;
          if (newTask.task.text == '') {
            this.tags[i].errors.text = 'タスクを入力してください。';
          } else {
            this.tags[i].errors.text = '';
          }
          // if (!newTask.task.deadline) {
          //   this.tags[i].errors.deadline = '締め切りを設定してください。';
          // } else {
          //   this.tags[i].errors.deadline = '';
          // }
        }
      },
      clearTasks: function (tag_id) {
        const clearedTasks = {
          tasks: [],
          tag_id: tag_id
        }
        var targetTag;
        var targetTasks = []
        this.tags.forEach(tag => {
          if (tag.id == tag_id) {
            targetTag = tag;
          }
        })
        targetTag.tasks.forEach(task => {
          if (task.checked) {
            targetTasks.push(task.id);
          }
        })
        clearedTasks.tasks = targetTasks;
        axios.post('/api/task/clear', clearedTasks)
          .then(() => {
            console.log('just cleared tasks')
            var taskIndex = 0;
            var tagIndex = this.getTagIndex(tag_id);
            var targetTag = this.tags[tagIndex];
            var sliceElemment = [];
            targetTag.tasks.forEach(task => {
              clearedTasks.tasks.forEach(checkedTask => {
                if (task.id == checkedTask) {
                  sliceElemment.push(taskIndex);
                }
              })
              taskIndex++;
            })
            sliceElemment.reverse();
            sliceElemment.forEach(element => {
              this.tags[tagIndex].tasks.splice(element, 1);
            });
            var emerCount = 0;
            var todayCount = 0;
            var deadCount = 0;
            targetTag.tasks.forEach(task => {
              if (task.limit != null) {
                if (task.limit < 0) {
                  deadCount++;
                } else if (task.limit == 0) {
                  todayCount++;
                } else if (task.limit <= 3) {
                  emerCount++;
                }
              }
            })
            if (deadCount > 0) {
              targetTag.emergency = 3;
            } else if (todayCount > 0) {
              targetTag.emergency = 2;
            } else if (emerCount > 0) {
              targetTag.emergency = 1;
            } else {
              targetTag.emergency = 0;
            }
            clearedTasks.tasks = [],
            clearedTasks.tag_id = ''
          })
          .catch(() => {
            console.log('after clearTasks error')
          });
      },
      deleteTag: function() {
        axios.delete('/api/tags/'+this.deleteTarget)
          .then(() => {
            var tagIndex = this.getTagIndex(this.deleteTarget)
            this.tags.splice(tagIndex, 1),
            this.newTaskTextItems.splice(tagIndex, 1),
            this.newTaskDeadlineItems.splice(tagIndex, 1),
            this.newTaskPriorityItems.splice(tagIndex, 1)
            this.deleteConf = false
          }).catch(() => {
            console.log('after deleteTag error')
          });
      },
      getAxios: function () {
        axios.get('/api/tags')
          .then( res => {
            this.tags = res.data.tags,
            this.newTaskTextItems = res.data.newTaskTextItems,
            this.newTaskDeadlineItems = res.data.newTaskDeadlineItems,
            this.newTaskPriorityItems = res.data.newTaskPriorityItems,
            this.checkedItems = res.data.checkedItems
          }).catch(() => {
            console.log('after getAxios error')
          });
      },
      getTagIndex: function (tagId) {
        var tagIndex = 0;
        for(var i = 0; i < this.tags.length; i++){
          if (tagId == this.tags[i].id) {
            tagIndex = i;
          }
        }
        return tagIndex;
      },
      changeStatus: function (newStatus) {
        const changedStatus = {
          status : newStatus,
          tag_id : this.changeStatusTag
        }
        axios.put('/api/tags/' + this.changeStatusTag, changedStatus)
          .then(function() {
            console.log('just changed status')
            this.tags[this.getTagIndex(this.changeStatusTag)].status = newStatus
            this.tags.sort(function(a,b){
              if(a.status>b.status) return -1;
              if(a.status < b.status) return 1;
              return 0;
            });
            this.showStatusFrom = false;
          }.bind(this))
          .catch(() => {
            console.log('after changeStatus error')
          });
      }
    },
    mounted: function () {

      this.getAxios(),

      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            this.helloWorld = true
          )
        }, 600)
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              this.firstModal = false
            )
          }, 1000)
        })
      })

    },
    data: {
      tags: [],
      options: [
        { name: "低", id: 1 },
        { name: "中", id: 2 },
        { name: "高", id: 3 }
      ],
      showNewTagForm: false,
      showStatusFrom: false,
      changeStatusTag: 0,
      deleteConf: false,
      deleteTarget: 0,
      helloWorld: false,
      firstModal: true,
      newTagTitle: '',
      loading: false,
      submitting: false,
      newTaskTextItems: [],
      newTaskDeadlineItems: [],
      newTaskPriorityItems: [],
      errors: ''
    }
  })

  Vue.component('v-select', vSelect)
})

// parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  return new Date(parts[0], parts[1]-1, parts[2]);
}