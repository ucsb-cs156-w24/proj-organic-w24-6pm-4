package edu.ucsb.cs156.organic.entities;

import lombok.*;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "Schools")
public class School {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private String abbrev;
  private String name;
  private String termRegex;
  private String termDescription;
  private String termError;
}
