import { Request, response, Response } from "express";
import getAllUsers from "./getAllUsers";

describe('Get all users request', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            statusCode: 0,
            send: jest.fn().mockImplementation(result => {
                responseObject = result;
            }),
        }
    })

    test('200-users', () => {
        const expectedStatusCode = 200;
        const expectedResponse = {
            users: [
                {
                    name: 'john',
                    age: 30
                },
                {
                    name: 'Peter',
                    age: 32
                }
            ]
        };
        getAllUsers(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.statusCode).toBe(expectedStatusCode);
        expect(responseObject).toEqual(expectedResponse);

    })
})