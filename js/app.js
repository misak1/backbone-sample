(function(){
/*$(function() {*/
  var Task = Backbone.Model.extend({
    defaults:{
      title: 'do someting',
      completed : false
    },
    initialize: function (){
      // invalidはvalidateが失敗した時に呼ばれるイベント
      this.on('invalid', function(model, error){
        $('#error').html(error);
      });
    },
    validate: function(attrs){
      if(_.isEmpty(attrs.title)){
        return 'this must not be empty';
      }
    }
  });
  var Tasks = Backbone.Collection.extend({model:Task});
  var TaskView = Backbone.View.extend({
    tagName:'li',
    initialize: function(){
      // 監視イベントを登録
      this.model.on('destroy', this.remove, this);
      this.model.on('change', this.render, this);
    },
    events: {
      'click .delete': 'destroy',
      'click .toggle': 'toggle'
    },
    // データ削除ダイアログ
    destroy: function(){
      if(confirm('are you sure?')){
        this.model.destroy();
      }
    },
    // データ切り替え
    toggle: function(){
        this.model.set('completed', !this.model.get('completed'));
    },
    remove: function(){
      this.$el.remove();
    },
    template: _.template($('#task-template').html()),
    render: function(){
      console.log(this.model.toJSON());
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
     }
  });
  var TasksViews = Backbone.View.extend({
    tagName:'ul',
    initialize: function(){
      this.collection.on('add', this.addNew, this);
      this.collection.on('change', this.updateCount, this);
      this.collection.on('destroy', this.updateCount, this);
    },
    addNew: function(task){
      var taskView = new TaskView({model: task});
      this.$el.append(taskView.render().el);
      $("#title").val('').focus();
      this.updateCount();
    },
    updateCount: function(){
      var uncompletedtasks = this.collection.filter(function(task){
        return !task.get('completed'); 
      });
      $('#count').html(uncompletedtasks.length);
    },
    render: function(){
      this.collection.each(function(task){
        var taskView = new TaskView({model: task});
        this.$el.append(taskView.render().el);
      }, this);
      this.updateCount();
      return this;
     }
  });
  var AddTaskView = Backbone.View.extend({
    el:'#addTask',
    events:{
      'submit': 'submit'
    },
    submit: function(evt){
      // イベント抑止
      evt.preventDefault();
      //var task = new Task({title: $('#title').val()});
      //this.collection.add(task);
      var task = new Task();
      // validate:trueは必須
      if(task.set({title: $('#title').val()}, {validate: true})){
        this.collection.add(task); 
        // エラー文言削除
        $('#error').empty();
      }
    }
  });
    
  var tasks = new Tasks([
    {
      title: "task1", 
      completed: true
    }, 
    {
      title: "task2" 
    }, 
    {
      title: "task3"
    } 
  ]);
  var tasksView = new TasksViews({collection: tasks});
  var addTaskView = new AddTaskView({collection: tasks});
  $('#tasks').html(tasksView.render().el);
/* }); */
})();
