const workflowRepository = require('./workflow-repository');
const Workflow = require('./workflow');

class WorkflowService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} id
   * @returns {Promise<Workflow>}
   */
  getWorkflowById(id) {
    return workflowRepository.getById(this.mongodb, id);
  }

  /**
   * @param {string} id
   * @returns {Promise<Workflow>}
   */
  getLastByEntityId(id) {
    return workflowRepository.getLastByEntityId(this.mongodb, id);
  }

  /**
   * @param {object} filter
   * @param {number} skip
   * @param {number} count
   * @returns {Promise<Array<Workflow>>}
   */
  getWorkflows(filter, skip, count) {
    return workflowRepository.getAll(this.mongodb, filter, skip, count);
  }

  /**
   * @param {Workflow} workflow
   * @returns {Promise<Workflow>}
   */
  updateWorkflow(workflow) {
    return workflowRepository.replace(this.mongodb, new Workflow(workflow));
  }

  /**
   * @param {Workflow} workflow
   * @returns {Promise<Workflow>}
   */
  async nextWorkflowState(workflow) {
    const thisWorkflow = await workflowRepository.getById(this.mongodb, workflow._id);
    const nextWorkflow = new Workflow({
      type: thisWorkflow.type,
      entityId: thisWorkflow.entityId,
      approverId: workflow.approverId,
      approverRoleId: workflow.approverRoleId,
      approverDisplayName: workflow.approverDisplayName,
      state: workflow.state,
      reason: workflow.reason,
    });
    return workflowRepository.insert(this.mongodb, nextWorkflow);
  }

  /**
   * @param {Workflow} workflow
   * @returns {Promise<Workflow>}
   */
  insertWorkflow(workflow) {
    return workflowRepository.insert(this.mongodb, new Workflow(workflow));
  }

  createIndexes() {
    return workflowRepository.createIndexes(this.mongodb);
  }
}

module.exports = WorkflowService;
