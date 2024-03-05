package edu.ucsb.cs156.organic.controllers;

import edu.ucsb.cs156.organic.entities.School;
import edu.ucsb.cs156.organic.errors.EntityNotFoundException;
import edu.ucsb.cs156.organic.repositories.SchoolRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "Schools")
@RequestMapping("/api/Schools")
@RestController
@Slf4j
public class SchoolsController extends ApiController {

    @Autowired
    SchoolRepository schoolRepository;

    @Operation(summary= "List all schools")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<School> allSchools() {
        Iterable<School> schools = schoolRepository.findAll();
        return schools;
    }

    @Operation(summary= "Create a new school")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public School postSchool(
            @Parameter(name="name") @RequestParam String name,
            @Parameter(name="abbrev") @RequestParam String abbrev)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        // log.info("localDateTime={}", localDateTime);

        School school = new School();
        school.setName(name);
        school.setAbbrev(abbrev);

        School savedSchool = schoolRepository.save(school);

        return savedSchool;
    }

    @Operation(summary= "Get a single school")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public School getById(
            @Parameter(name="id") @RequestParam Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(School.class, id));

        return school;
    }

    @Operation(summary= "Delete a school")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteSchool(
            @Parameter(name="id") @RequestParam Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(School.class, id));

        schoolRepository.delete(school);
        return genericMessage("School with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a school")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public School updateSchool(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid School incoming) {

                School school = schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(School.class, id));

                school.setName(incoming.getName());
                school.setAbbrev(incoming.getAbbrev());

        schoolRepository.save(school);

        return school;
    }

}