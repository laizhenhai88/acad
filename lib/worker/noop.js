module.exports = {
  // return true the task will be add to manager
  async beforeAddTask(task) {
    return true;
  },
  // set task.status 'success' or 'failed'
  // only task.result will persist to db, even though task failed
  async doTask(task) {
    task.status = 'success'
  },
  async success(task, tm) {
  },
  async failed(task, tm) {
  }
};
