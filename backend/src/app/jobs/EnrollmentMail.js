import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail'; // for each job a unique key
  }

  // task that will be performed when the process is executed
  async handle({ data }) {
    const { plan, student, end_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula realizada com Sucesso. Bem-vindo(a)!',
      template: 'enrollment',
      context: {
        student: student.name,
        plan: plan.title,
        end_date: format(parseISO(end_date), "'Dia' dd 'de' MMMM'", {
          locale: pt
        }),
        price
      }
    });
  }
}

export default new EnrollmentMail();
