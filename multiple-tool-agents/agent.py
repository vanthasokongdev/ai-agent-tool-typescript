import datetime
from zoneinfo import ZoneInfo
from google.adk.agents import Agent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters

# root_agent = Agent(
#     name="weather_time_agent",
#     model="gemini-2.0-flash",
#     description=(
#         "Agent to answer questions about the time and weather in a city."
#     ),
#     instruction=(
#         "You are a helpful agent who can answer user questions about the time and weather in a city."
#     ),
#     tools=[
#         MCPToolset(
#             connection_params=StdioServerParameters(
#                 args=[
#                     'mcp-server\dist\index.js'
#                 ],
#                 command="node"
#             )
#         )
#     ],
# )

root_agent = Agent(
    name="recent_places_agent",
    model="gemini-2.0-flash",
    description=(
        "Agent that fetches and returns a list of recent places. "
        "Useful for location-based queries or retrieving a recent history of visited or queried places."
    ),
    # instruction=(
    #     "You are a helpful assistant that retrieves and returns a list of recent places from the MCP tool. "
    #     "Ensure the data returned is relevant and formatted clearly for the user."
    # ),
    instruction=(
        "You are a helpful assistant that can:\n"
        "1. Fetch and return a list of recent places.\n"
        "2. Fetch detailed information about a specific place by its ID.\n"
        "Use the appropriate tool based on the user's request."
    ),
    tools=[
        MCPToolset(
            connection_params=StdioServerParameters(
                args=[
                    'mcp-server\\dist\\index.js'
                ],
                command="node"
            )
        )
    ],
)