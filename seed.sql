
DROP DATABASE IF EXISTS dicespot;
CREATE DATABASE dicespot;
USE dicespot;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(100),
  price DECIMAL(10,2),
  description TEXT,
  image VARCHAR(255)
);


INSERT INTO products (name, category, price, description, image) VALUES
('Warhammer 40K: Space Marines', 'Warhammer', 89.99, 'Elite Space Marines squad.', '/img/space_marine_set_miniature.jpg'),
('Warhammer Orks Boyz', 'Warhammer', 42.00, 'Brutal Orks infantry for close combat.', '/img/miniatures_ork.jpg'),
('D&D Player Handbook', 'DnD', 49.90, 'Essential rulebook for Dungeons & Dragons adventurers.', '/img/player_handbook.jpg'),
('Dice Set  Dragon Breath', 'DnD', 19.99, 'A fiery set of polyhedral dice forged in dragon flame.', '/img/dice_dragon_set.jpg'),
('Warhammer Paint Set', 'Warhammer', 24.90, 'A collection of Citadel paints for your Space Marines.', '/img/warhammer_paint_set.jpg'),
('D&D Starter Kit', 'DnD', 39.90, 'Includes pre-made characters, adventure book, and dice.', '/img/dnd_starter_kit.jpg');
