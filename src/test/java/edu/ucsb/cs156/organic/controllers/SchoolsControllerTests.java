package edu.ucsb.cs156.organic.controllers;

import edu.ucsb.cs156.organic.repositories.UserRepository;
import edu.ucsb.cs156.organic.testconfig.TestConfig;
import edu.ucsb.cs156.organic.controllers.ControllerTestCase;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.awaitility.Awaitility.await;

import static java.util.concurrent.TimeUnit.SECONDS;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.organic.entities.School;
import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.entities.jobs.Job;
import edu.ucsb.cs156.organic.repositories.SchoolRepository;
import edu.ucsb.cs156.organic.repositories.UserRepository;
import edu.ucsb.cs156.organic.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.organic.services.jobs.JobService;
import lombok.extern.slf4j.Slf4j;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

import java.util.Map;

@WebMvcTest(controllers = SchoolsController.class)
@Import(JobService.class)
@AutoConfigureDataJpa
public class SchoolsControllerTests extends ControllerTestCase {

        @MockBean
        SchoolRepository schoolRepository;

        @MockBean
        UserRepository userRepository;

        // Tests for GET /api/Schools/all
        
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/Schools/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/Schools/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_schools() throws Exception {

                // arrange
                School school1 = School.builder()
                                .abbrev("UCSB")
                                .name("University of California Santa Barbara")
                                .termRegex("regex1")
                                .termDescription("desc1")
                                .termError("error1")
                                .build();

                School school2 = School.builder()
                                .abbrev("UCLA")
                                .name("University of California Los Angeles")
                                .termRegex("regex2")
                                .termDescription("desc2")
                                .termError("error2")
                                .build();

                ArrayList<School> expectedSchools = new ArrayList<>();
                expectedSchools.addAll(Arrays.asList(school1, school2));

                when(schoolRepository.findAll()).thenReturn(expectedSchools);

                // act
                MvcResult response = mockMvc.perform(get("/api/Schools/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(schoolRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedSchools);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for POST /api/Schools/post...

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/Schools/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/Schools/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_school() throws Exception {
                // arrange

                School school1 = School.builder()
                                .abbrev("UCSB")
                                .name("University of California Santa Barbara")
                                .termRegex("regex1")
                                .termDescription("desc1")
                                .termError("error1")
                                .build();

                when(schoolRepository.save(eq(school1))).thenReturn(school1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/Schools/post?abbrev=UCSB&name=University of California Santa Barbara&termRegex=regex1&termDescription=desc1&termError=error1")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(schoolRepository, times(1)).save(school1);
                String expectedJson = mapper.writeValueAsString(school1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests for GET /api/Schools?id=...

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/Schools?id=123"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                School school1 = School.builder()
                                .abbrev("UCSB")
                                .name("University of California Santa Barbara")
                                .termRegex("regex1")
                                .termDescription("desc1")
                                .termError("error1")
                                .build();

                when(schoolRepository.findById(eq(123L))).thenReturn(Optional.of(school1));

                // act
                MvcResult response = mockMvc.perform(get("/api/Schools?id=123"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(schoolRepository, times(1)).findById(eq(123L));
                String expectedJson = mapper.writeValueAsString(school1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(schoolRepository.findById(eq(123L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/Schools?id=123"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(schoolRepository, times(1)).findById(eq(123L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("School with id 123 not found", json.get("message"));
        }


        // Tests for DELETE /api/Schools?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_request() throws Exception {
                // arrange

                School school1 = School.builder()
                                .abbrev("UCSB")
                                .name("University of California Santa Barbara")
                                .termRegex("regex1")
                                .termDescription("desc1")
                                .termError("error1")
                                .build();

                when(schoolRepository.findById(eq(123L))).thenReturn(Optional.of(school1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/Schools?id=123")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(schoolRepository, times(1)).findById(123L);
                verify(schoolRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("School with id 123 deleted", json.get("message"));
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_request_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(schoolRepository.findById(eq(123L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/Schools?id=123")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(schoolRepository, times(1)).findById(123L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("School with id 123 not found", json.get("message"));
        }

        // Tests for PUT /api/Schools?id=... 

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_request() throws Exception {
                // arrange

                School schoolOrig = School.builder()
                                .abbrev("UCSB")
                                .name("University of California Santa Barbara")
                                .termRegex("regex1")
                                .termDescription("desc1")
                                .termError("error1")
                                .build();


                School schoolEdit = School.builder()
                                .abbrev("UCLA")
                                .name("University of California Los Angeles")
                                .termRegex("regex2")
                                .termDescription("desc2")
                                .termError("error2")
                                .build();

                String requestBody = mapper.writeValueAsString(schoolEdit);

                when(schoolRepository.findById(eq(123L))).thenReturn(Optional.of(schoolOrig));

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/Schools?id=123")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(schoolRepository, times(1)).findById(123L);
                verify(schoolRepository, times(1)).save(schoolEdit); // should be saved with correct user
                String responseString = response.getResponse().getContentAsString();
                assertEquals(requestBody, responseString);
        }

        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_request_that_does_not_exist() throws Exception {
                // arrange

                School schoolEdit = School.builder()
                                .abbrev("UCLA")
                                .name("University of California Los Angeles")
                                .termRegex("regex2")
                                .termDescription("desc2")
                                .termError("error2")
                                .build();

                String requestBody = mapper.writeValueAsString(schoolEdit);

                when(schoolRepository.findById(eq(123L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/Schools?id=123")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(schoolRepository, times(1)).findById(123L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("School with id 123 not found", json.get("message"));

        }
}