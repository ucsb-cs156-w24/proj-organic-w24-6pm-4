import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useBackend } from 'main/utils/useBackend';
import { useState } from "react";
import SchoolsDropdown from '../Schools/SchoolsDropdown';

function CourseForm({ initialContents, submitAction, buttonLabel = "Create" }) {
   
    const [activeSchool, setActiveSchool] = useState()

    const {data: schools, error: _error, status: _status} = 
        useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/Schools/all"],
        // Stryker disable next-line all : GET is the default
        { method: "GET", url: "/api/Schools/all" }, []
        );
   
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="CourseForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-name"
                            id="name"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("name", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name && 'Name is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" onChange={() => { 
                        setActiveSchool(document.getElementById("FormSelect").value);
                        setValue("school", document.getElementById("FormSelect").value);
                        }}>
                        <Form.Label htmlForm="school">School</Form.Label>
                        <Form.Control
                            data-testid = "CourseForm-school"
                            id = "school"
                            type = "hidden"
                            value = { activeSchool }
                            isInvalid={Boolean(errors.school)}
                            {...register("school", {required: true})}
                        >
                        </Form.Control>
                        <SchoolsDropdown schools={schools} initialContents={initialContents}></SchoolsDropdown>
                        <Form.Control.Feedback type="invalid">
                            {errors.school && 'School is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="term">Term</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-term"
                            id="term"
                            type="text"
                            isInvalid={Boolean(errors.term)}
                            {...register("term", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.term && 'Term is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="startDate">StartDate(iso format)</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-startDate"
                            id="startDate"
                            type="datetime-local"
                            isInvalid={Boolean(errors.startDate)}
                            {...register("startDate", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.startDate && 'StartDate date is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="endDate">EndDate(iso format)</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-endDate"
                            id="endDate"
                            type="datetime-local"
                            isInvalid={Boolean(errors.endDate)}
                            {...register("endDate", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.endDate && 'EndDate date is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="githubOrg">GithubOrg</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-githubOrg"
                            id="githubOrg"
                            type="text"
                            isInvalid={Boolean(errors.githubOrg)}
                            {...register("githubOrg", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.githubOrg && 'GithubOrg is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="CourseForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="CourseForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default CourseForm
