CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  concluida BOOLEAN NOT NULL DEFAULT false,
  criada_em TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO tasks (titulo, concluida) VALUES
  ('Comprar pão', false),
  ('Estudar Docker', true),
  ('Montar o projeto todo-app', false);
