import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import CheckIn from '../schemas/CheckIn';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';

class CheckInController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    /**
     * Get actual date
     * Verify if student has an active plan
     */
    const today = startOfDay(new Date());
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: student.id,
        start_date: {
          [Op.lte]: today // star_date <= today
        },
        end_date: {
          [Op.gte]: today // end_date >= today
        }
      }
    });
    if (!enrollment) {
      return res.status(401).json({
        error:
          'The student does not have an active plan - Please contact your gym manager'
      });
    }

    /**
     * If student already have your 5 checkins
     */
    const checkInPeriod = subDays(today, 6);

    const checkins = await CheckIn.find({ student_id: student.id })
      .gte('createdAt', startOfDay(checkInPeriod))
      .lte('createdAt', endOfDay(today))
      .countDocuments();

    if (checkins >= 5) {
      return res
        .status(401)
        .json({ error: 'You already reach the limit of your checkins.' });
    }

    /**
     * Crete checkin if all the validations are okay
     */
    const checkin = await CheckIn.create({
      student_id: student.id
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(401).json({ error: 'Student does not exists' });
    }

    const checkins = await CheckIn.find({ student_id: student.id }).sort({
      createdAt: 'desc'
    });

    return res.json(checkins);
  }
}

export default new CheckInController();
