const characters = [
  "Batman",
  "Superman",
  "Wonder Woman",
  "Spider-Man",
  "Iron Man",
  "Black Widow",
  "Captain America",
  "Thor",
  "Hulk",
  "Wolverine",
  "Deadpool",
  "Black Panther",
  "Doctor Strange",
  "Harley Quinn",
  "Joker",
  "Catwoman",
  "Green Lantern",
  "Flash",
  "Aquaman",
  "Ant-Man",
  "Walter White",
  "Jesse Pinkman",
  "Tony Soprano",
  "Walter White Jr.",
  "Dexter Morgan",
  "Tony Stark",
  "Cersei Lannister",
  "Tyrion Lannister",
  "Arya Stark",
  "Daenerys Targaryen"
]

export const getRandomCharacter = () => {
  const randomIndex = Math.floor(Math.random() * characters.length)
  return characters[randomIndex]
}
