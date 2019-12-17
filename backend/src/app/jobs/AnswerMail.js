import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMailil';
  }

  /**
   * Tarefa a ser executada quando a task for chamada
   */
  async handle({ data }) {
    const { student, helpOrders, answer, answer_at } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `${helpOrders.question}`,
      template: 'answerHelpOrder',
      context: {
        student: student.name,
        question: helpOrders.question,
        answer,
        answer_at: format(
          parseISO(answer_at),
          "'Dia' dd 'de' MMMM', as' H:mm'h'",
          {
            locale: pt
          }
        )
      }
    });
  }
}

export default new AnswerMail();
