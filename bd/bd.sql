CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    prazo DATE,
    completed BOOLEAN DEFAULT FALSE
);