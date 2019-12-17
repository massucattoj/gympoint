import Bee from 'bee-queue';
import EnrollmentMail from '../app/jobs/EnrollmentMail';
import AnswerMail from '../app/jobs/AnswerMail';
import redisConfig from '../config/redis';

const jobs = [EnrollmentMail, AnswerMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    /**
     * Percorrer os jobs
     */
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        }),
        handle
      };
    });
  }

  /**
   * create a job that will be added at the queue
   * each email is a job
   * add(name of the queue, date of the job)
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      // bee.process(handle);
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
