import * as Yup from 'yup';
import { addMonths, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class EnrollmentController {
  async store(req, res) {
    /**
     * Create new Enrollment
     */

    // Validation Schema
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
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
    //

    // last validation -> student already have an active plan
    const validateEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        plan_id,
        end_data: isBefore(parseISO(start_date), Enrollment.end_date)
      }
    });
    if (validateEnrollment) {
      return res
        .status(400)
        .json({ error: 'Student already have an active Plan' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.duration * plan.price;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });

    // // send email!
    // await Mail.sendMail({
    //   to: `${student.name} <${student.email}>`,
    //   subject: 'Matricula realizada com Sucesso. Bem-vindo(a)!',
    //   template: 'enrollment',
    //   context: {
    //     student: student.name,
    //     plan: plan.title,
    //     end_date: format(end_date, "'Dia' dd 'de' MMMM'", { locale: pt }),
    //     price
    //   }
    // });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
