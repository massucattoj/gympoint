import * as Yup from 'yup';

import HelpOrder from '../schemas/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valiidation fails' });
    }

    // Verify if student exists
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(401).json({ error: 'Student does not exists' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: student.id,
      question: req.body.question
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(401).json({ error: 'Student does not exists' });
    }

    const helpOrders = await HelpOrder.find({ student_id: student.id });
    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
