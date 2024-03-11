package edu.ucsb.cs156.organic.repositories;

import edu.ucsb.cs156.organic.entities.School;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolRepository extends CrudRepository<School, Long> {
    // Iterable<School> findById(long id);
    // Iterable<School> findByName(String name);
    // Optional<School> findByAbbrev(String abbrev);
}
