import * as Yup from 'yup';
import { addMonths, parseISO, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async store(req, res) {
    /**
     * Create new Enrollment
     */

    // Validation Schema
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    //

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Student need exist
     * Plan Need exist
     * Enrollment day doesn't be a past date
     * Student already have an active plan
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const validateEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        end_date: {
          [Op.gt]: parseISO(start_date) // greater then start_date
        }
      }
    });
    if (validateEnrollment) {
      return res
        .status(400)
        .json({ error: 'Student already have an active Plan' });
    }

    // Create Enrollment
    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.duration * plan.price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });

    await Queue.add(EnrollmentMail.key, {
      plan,
      student,
      end_date,
      price
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    /**
     * Show all the enrollments
     */
    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async update(req, res) {
    /**
     * Yup validation schema
     */
    const schema = Yup.object().shape({
      student_id: Yup.number().positive(),
      plan_id: Yup.number().positive(),
      start_date: Yup.date()
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails - Cannot Update!' });
    }

    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrolmment does not exists' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const student = await Student.findByPk(req.body.student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    /**
     * If body.start_date diff from enrollment.start_date and
     * body.start_date is not a past date
     * then change enrollment start_date and end_date is calculated auto
     */
    if (
      req.body.start_date !== enrollment.start_date &&
      !isBefore(parseISO(req.body.start_date), new Date())
    ) {
      const new_end = addMonths(parseISO(req.body.start_date), plan.duration);
      req.body.end_date = new_end;
    }

    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    } = await enrollment.update(req.body);

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });
  }

  async delete(req, res) {
    /**
     * Delete enrollment
     */
    await Enrollment.destroy({
      where: { id: req.params.id }
    });

    return res.json({ error: 'Enrollment deleted with successful!' });
  }
}

export default new EnrollmentController();
