import Student from '../models/Student';

class StudentController {
  // cadastro de usuario
  async store(req, res) {
    // verificar se ja existe email cadastrado
    const studentExists = await Student.findOne({
      where: { email: req.body.email }
    });
    if (studentExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // seu usuario nao existir...retorno para o front
    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );
    // const student = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura
    });
  }
}

export default new StudentController();
